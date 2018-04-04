import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CertinfoPage } from '../certinfo/certinfo';

/**
 * Generated class for the TxinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-txinfo',
  templateUrl: 'txinfo.html',
})
export class TxinfoPage {
  tx: any;
  mosaics: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.tx = navParams.get("tx");
  	this.mosaics = navParams.get("mosaics");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TxinfoPage');
  }

  certinfo(id){
    this.navCtrl.push(CertinfoPage, {id : id})
  }

}
