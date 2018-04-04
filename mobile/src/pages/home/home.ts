import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { CertinfoPage } from '../certinfo/certinfo';
import { TxinfoPage } from '../txinfo/txinfo';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { DataProvider } from '../../providers/data/data';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CryptoProvider, DataProvider]
})

export class HomePage {
  mode: string;
  txs: Array<any>;
  ptxs: Array<any>;
  mosaics: any;
  mosaic_keys: any;
  address: string;
  endpoint: string;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public http: HttpClient,
    public crypto: CryptoProvider,
    public data: DataProvider,
    )
  {
  	this.mode = 'history';
    this.mosaics = {};
  }
  ionViewDidEnter(){
    Promise.all([ this.storage.get('address'),  this.storage.get('endpoint')]).then(values => {
      this.address = values[0]
      this.endpoint = values[1]

      this.http
        .get(this.endpoint+'/account/transfers/all?address='+this.address)
        .subscribe(data => {
          this.txs = [];
          console.log(data);
          var c = 0;
          for(let d of data['data'].reverse()){
            if(c>25){break;}
            let addr = this.crypto.pk2addr(d.transaction.signer);
            let date = this.crypto.date_f(d.transaction.timeStamp);
            this.txs.push({
              signerAddress: addr,
              recipient: d.transaction.recipient,
              messagePayload: d.transaction.message.payload,
              fee: d.transaction.fee,
              mosaics: d.transaction.mosaics,
              date: date,
              type: d.meta['type']
            })
            c++;
          }
        })

      this.http
        .get(this.endpoint+'/account/unconfirmed-transfers/all?address='+this.address)
        .subscribe(data => {
          this.ptxs = [];
          console.log(data);
          for(let d of data['data'].reverse()){
            let addr = this.crypto.pk2addr(d.transaction.signer);
            let date = this.crypto.date_f(d.transaction.timeStamp);
            this.ptxs.push({
              signerAddress: addr,
              recipient: d.transaction.recipient,
              messagePayload: d.transaction.message.payload,
              fee: d.transaction.fee,
              mosaics: d.transaction.mosaics,
              date: date,
              type: d.meta['type']
            })
          }
        })

      this.http
        .get(this.endpoint+'/account/get?address='+this.address)
        .subscribe(data => {
          let promises = []
          for(let key in data['balance']){
            promises.push(this.data.certInfo(key));
          }
          Promise.all(promises).then(values => {
            this.mosaic_keys = [];
            for(let key in data['balance']){
              this.mosaics[key] = {};
              this.mosaic_keys.push(key);
            }
            console.log(values);
            for(let val of values){
              let dict = val;
              dict["quantity"] = data['balance'][val.id];
              this.mosaics[val.id] = dict;
              console.log(dict);
            }
            console.log(this.mosaics);
          })
        })
    });
  }
  certinfo(id){
    this.navCtrl.push(CertinfoPage, {id : id})
  }

  txinfo(tx){
    this.navCtrl.push(TxinfoPage, {tx : tx, mosaics: this.mosaics})
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewDidEnter()
      refresher.complete();
    }, 500);
  }



}
