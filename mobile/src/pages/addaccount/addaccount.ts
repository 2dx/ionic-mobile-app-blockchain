import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the AddaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addaccount',
  templateUrl: 'addaccount.html',
  providers: [CryptoProvider]
})
export class AddaccountPage {
  privateKey: string;
  publicKey: string;
  address: string;
  format: string;
  accounts: any;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public crypto: CryptoProvider,
    private alertCtrl: AlertController
  ) {
  	Promise.all([storage.get('accounts')]).then(values => {
        if (values[0] != null){
          this.accounts = JSON.parse(values[0]);
        }else{
          this.accounts = []
        }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddaccountPage');
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
  	// s = '{"privateKey":"632b075ca9cd853a6174cc98dce6e6d75965884479bd9eb1b5df4ef415af22fd"}'
    var accountinfo = JSON.parse(s);
    this.privateKey = accountinfo.privateKey;
    this.format = f;
    this.privateKeyChanged();
  }

  addAccount(){
    let flag = false;
    for(let account of this.accounts){
      if(account['privateKey']==this.privateKey) flag = true;
    }
    if(!flag){
      this.accounts.push({"privateKey":this.privateKey,"publicKey":this.publicKey,"address":this.address});
      this.storage.set('accounts', JSON.stringify(this.accounts));
      this.storage.set('address', this.address);
      this.navCtrl.push(MyApp);
    }else{
      let alert = this.alertCtrl.create({
        title: '登録済みアドレス',
        message: 'このアドレスはすでに登録済みです。設定ページから使用するアドレスを変更できます。',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  privateKeyChanged() {
    let AccountInfo = this.crypto.sk2pk(this.privateKey);
    this.publicKey = AccountInfo['publicKey'];
    this.address = AccountInfo['address'];
  }

}
