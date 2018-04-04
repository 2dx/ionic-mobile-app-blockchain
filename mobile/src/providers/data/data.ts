import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CryptoProvider } from '../crypto/crypto';

@Injectable()
export class DataProvider {

  constructor(public http: HttpClient, private storage: Storage, public crypto: CryptoProvider) {
    console.log('Hello DataProvider Provider');
  }

	certInfo(certId){
		// まず、storageから検索し、
		// 形式：　{'id':'0000000000000000','info':{'name':'base.xmc', ...}}
		return new Promise(resolve => {
			Promise.all([ this.storage.get('certinfo'),  this.storage.get('endpoint')]).then(values => {
  			let val = values[0];
  			let endpoint = values[1];
  			let certs = [];
  			if(val != null){
  				certs = JSON.parse(val); //リセットするならここをコメントアウト
  				for(let cert of certs){
  					if(cert.id == certId){
  						console.log("hit!");
  						resolve(cert.info);
  					}
  				}
  			}
  			console.log("miss!");
  			// 無かったら、ダウンロードして保存する
  			this.http
  				.get(endpoint+'/cert/info?id='+certId)
  				.subscribe(cii => {
    				console.log(cii);
    				let ci = cii['cert']['certificateDefinition'];
    				let dict = {"id": certId, "description": ci['description'], "name": ci['name'], "signer": cii['cert']['signer'], "timeStamp": cii['cert']['timeStamp']};
    				for(let item of ci['properties']){
    					dict[item['name']] = item['value'];
    				}
    				dict['date'] = this.crypto.date_f(cii['cert']['timeStamp']);
    				dict['signerAddress'] = this.crypto.pk2addr(cii['cert']['signer']);
            certs.push({'id':certId,'info':dict})
    				this.storage.set('certinfo', JSON.stringify(certs));
    				resolve(dict);
    			})
			});
		});
  };
}
