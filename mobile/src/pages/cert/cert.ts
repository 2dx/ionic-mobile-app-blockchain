import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { CryptoProvider} from '../../providers/crypto/crypto';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the CertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cert',
  templateUrl: 'cert.html',
  providers: [CryptoProvider]
})
export class CertPage {

  address: string;
  endpoint: string;
  name: string;
  description: string;
  expireDate: Date;
  supply: string;
  unit: string;
  isenabled:boolean=true;
  accounts: any;


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    private storage: Storage,
    public crypto: CryptoProvider,
    private alertCtrl: AlertController,
    public http: HttpClient) {
  }

  ionViewDidLoad() {

  }
  send() {
    this.isenabled=false;
  	Promise.all([ this.storage.get('address'),  this.storage.get('endpoint')]).then(values => {
      this.address = values[0]
      this.endpoint = values[1]

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

		    this.http
			    .get(this.endpoint+'/cert/newid')
			    .subscribe(data => {
			      console.log(data['id']); // このIDをモザイクIDにする
			      let tx = {
							"timeStamp": this.crypto.epoch()-360,
							"fee": 15,
							"type": 3, // CERTDEF TRANSACTION
							"deadline": this.crypto.epoch()+3600,
							"version": 0, // MAINNET
							"signer": publicKey,
							"certificateDefinition": {
								"description": this.description,
								"id": data['id'],
								"name": this.name,
								"properties": [{
										"name": "supply",
										"value": this.supply // stringのまま送る
									},{
										"name": "unit",
										"value": this.unit
									}
								]
							}
						}

						console.log(tx);

						this.http
			        .post(this.endpoint+'/transaction/encode', tx, {
			          headers: new HttpHeaders().set('Content-Type', 'application/json'),
			        })
			        .subscribe(r=>{
			          if(r["message"]=="ok"){
			            //署名
			            let sig = this.crypto.sign(r["data"], privateKey);
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
		    })
    });
  }
}
