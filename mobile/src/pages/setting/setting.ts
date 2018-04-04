import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddaccountPage } from '../addaccount/addaccount';
import { PasswordPage } from '../password/password';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  endpoints: Array<string>;
  endpoint: string;
  accounts: Array<any>;
  address: string;
  addresses: Array<string>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
    ) {
    this.endpoints = ["http://nis.imagic.me:4000","http://nis.imagic.me:4001","http://nis.imagic.me:4002","http://localhost:8080"]
  }

  ionViewDidEnter() {
    Promise.all([ this.storage.get('address'), this.storage.get('accounts'), this.storage.get('endpoint')]).then(values => {
      console.log('selectedAddress');
      console.log(values[0]);
      this.address = values[0]
      if (values[1] != null){
          this.accounts = JSON.parse(values[1]);
      }else{
          this.accounts = [];
      }
      this.addresses = [];
      for(let acc of this.accounts){
        this.addresses.push(acc.address);
      }
      this.endpoint = values[2];
    });
  }

  addaddress() {
    this.navCtrl.push(AddaccountPage);
  }

  changePassword() {
    this.navCtrl.push(PasswordPage);
  }

  addressSelected(selectedValue: any) {
    console.log(selectedValue);
    this.storage.set('address', selectedValue);
  }
  endpointSelected(selectedValue: any) {
    console.log(selectedValue);
    this.storage.set('endpoint', selectedValue);
  }


}
