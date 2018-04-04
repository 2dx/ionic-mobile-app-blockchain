import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  password_DB: string;
  password: string;
  messageText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  	Promise.all([ storage.get('password')]).then(values => {
      this.password_DB = values[0]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
  	if (this.password_DB == this.password){
  		this.storage.set('lastlogin', 1);
  		this.navCtrl.push(MyApp);
  	}else{
      this.messageText = "パスワードが違います。";
    }
  }

}
