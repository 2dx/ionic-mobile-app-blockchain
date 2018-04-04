import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the QrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html',
})
export class QrPage {

  scannedText: string;
  format: string;
  address: string;
  message: string;
  quantity: string;
  createdInvoiceCode = null;
  mode: string;
 

  constructor(
    public barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
  ) {
    this.mode = 'scan';
  }


  ionViewDidEnter() {
    Promise.all([ this.storage.get('address'),  this.storage.get('endpoint')]).then(values => {
      this.address = values[0]
      var endpoint = values[1]
    });
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
    this.scannedText = s;
    this.format = f;
  }

  createInvoiceCode() {
    this.createdInvoiceCode = '{"v":2,"data":{"address":"'+this.address+'","mosaics":[{"id":"0000000000000000","quantity":'+this.quantity+'}],"message":"'+this.message+'"}}';
    console.log(this.createdInvoiceCode);
  }

}