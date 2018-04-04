import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CryptoProvider} from '../../providers/crypto/crypto';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the CertinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-certinfo',
  templateUrl: 'certinfo.html',
  providers: [CryptoProvider, DataProvider]
})
export class CertinfoPage {
  id: string;
  certInfo: any={};
  balance: number;
  address: string;
  endpoint: string;


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public crypto: CryptoProvider,
    private storage: Storage,
    public http: HttpClient,
    public data: DataProvider
  ) {
  	this.id = navParams.get("id");
  }

  ionViewDidLoad() {
  	this.certInfo = {};
    Promise.all([ this.storage.get('address'),  this.storage.get('endpoint')]).then(values => {
      this.address = values[0]
      this.endpoint = values[1]
      this.http
        .get(this.endpoint+'/account/get?address='+this.address)
        .subscribe(data => {
	        this.data.certInfo(this.id).then(dict => {
	          this.balance = data['balance'][this.id];
	          this.certInfo = dict;
	          for(let item of ["name","description","signer","supply","unit","signerAddress","date"]){
				  		this.certInfo[item] = dict[item];
				  	}
	        })
        })
    });
  }

}
