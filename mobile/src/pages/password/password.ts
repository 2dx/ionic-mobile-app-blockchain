import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  password1: string;
  password2: string;
  messageText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  setPassword() {
  	if(this.password1 == this.password2){
  	  this.storage.set('password', this.password1);
      this.navCtrl.push(MyApp);
  	}else{
      this.messageText = "確認用のパスワードが一致しません。"
    }
  }
}
