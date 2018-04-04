import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CryptoProvider} from '../../providers/crypto/crypto';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the SendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
  providers: [CryptoProvider, DataProvider]
})
export class SendPage {
  address: string;
  message: string;
  accounts: Array<any>;
  endpoint: string;
  recipient: string;
  format: string;
  attachedMosaics: Array<any>;
  attachedMosaicsQuantity: any;
  isenabled:boolean=true;
  mosaics: any;
  mosaic_keys: any;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public navParams: NavParams,
    public crypto: CryptoProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public http: HttpClient,
    public data: DataProvider) {
    this.attachedMosaicsQuantity = [];
    this.message = "";
  }

  scan(){
    this.barcodeScanner.scan()
    .then((barcodeData)=>{
      if(barcodeData.cancelled){
        this.setValues("", "(cancelled)");
      }
      else{
        this.setValues(
          barcodeData.text || '???',
          barcodeData.format || '???'
        );
      }
    })
    .catch((err)=>{
      this.setValues(`Error ${err}`, "");
    });
  }

  clear(){
    this.setValues("", "");
  }

  setValues(s, f){
    // s = '{"v":2,"data":{"address":"MR32CIQG3E3LWRPENK4I3VUT5NBJ2RJXENQJUXOD","mosaics":[{"id":"0000000000000000","quantity":200}],"message":"hello"}}';
    let dict = JSON.parse(s);
    console.log(dict);
    console.log(dict['data']['mosaics']);
    this.recipient = dict['data']['address'];
    this.message = dict['data']['message'];
    this.attachedMosaics = [];
    this.attachedMosaicsQuantity = {};
    for(let m of dict['data']['mosaics']){
      this.attachedMosaics.push(m['id']);
      this.attachedMosaicsQuantity[m['id']]=m['quantity'];
    }
    this.format = f;
  }

  ionViewDidEnter() {
    Promise.all([ this.storage.get('address'),  this.storage.get('endpoint')]).then(values => {
      this.address = values[0]
      this.endpoint = values[1]
      this.http
        .get(this.endpoint+'/account/get?address='+this.address)
        .subscribe(data => {
          this.mosaics = {};
          this.mosaic_keys = [];
          for(let key in data['balance']){
            this.data.certInfo(key).then(dict => {
              dict["quantity"] = data['balance'][key];
              this.mosaics[key] = dict;
              console.log(dict);
              this.mosaic_keys.push(key);
            })
          }
        })
    });
  }

  send() {
    this.isenabled=false;

    let mosaicsNQ = [];
    if(!this.attachedMosaics){
      let alert = this.alertCtrl.create({
        message: 'メッセージのみをトランザクションに含めます。よろしいですか？',
        buttons: ['OK']
      });
      alert.present();
      this.attachedMosaics = [];
    }
    for(let i = 0; i<this.attachedMosaics.length; i++){
      console.log(i,this.attachedMosaics[i],this.attachedMosaicsQuantity[i]);
      mosaicsNQ.push({
          "id": this.attachedMosaics[i],
          "quantity": parseInt(this.attachedMosaicsQuantity[this.attachedMosaics[i]])
      });
    }
    console.log(mosaicsNQ);


    Promise.all([ this.storage.get('accounts')]).then(values => {
      if (values[0] != null){
        this.accounts = JSON.parse(values[0]);
      }else{
        this.accounts = []
      }

      let publicKey = null;
      let privateKey = null;
      for(let acc of this.accounts){
        if(acc.address == this.address){
          publicKey = acc.publicKey;
          privateKey = acc.privateKey
        }
      }
      console.log(publicKey);

      let tx = {
        "timeStamp": this.crypto.epoch()-5,
        "fee": 15,
        "recipient": this.recipient,
        "type": 0,
        "deadline": this.crypto.epoch()+3600,
        "message":
        {
          "payload": this.message,
          "type": 1
        },
        "version": 0,
        "signer": publicKey,
        "mosaics": mosaicsNQ
      }
      this.http
        .post(this.endpoint+'/transaction/encode', tx, {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        })
        .subscribe(r=>{
          if(r["message"]=="ok"){
            //署名
            let sig = this.crypto.sign(r["data"], privateKey);
            console.log(sig);
            //アナウンス
            this.http
              .post(this.endpoint+'/transaction/announce', {"data":r["data"], "signature":sig}, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
              })
              .subscribe(s=>{
                console.log("data:", s)
                if(s["message"]=="ok"){
                  let alert = this.alertCtrl.create({
                    message: '送信しました。',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.isenabled=true;
                }else{
                  let alert = this.alertCtrl.create({
                    title: 'エラー',
                    message: s["detail"],
                    buttons: ['OK']
                  });
                  alert.present();
                  this.isenabled=true;
                }
              });
          }else{
            let alert = this.alertCtrl.create({
              title: 'エラー',
              message: r["detail"],
              buttons: ['OK']
            });
            alert.present();
            this.isenabled=true;
          }
        });

    });
  }

}
