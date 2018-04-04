import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AddaccountPage } from '../pages/addaccount/addaccount';
import { PasswordPage } from '../pages/password/password';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  password: string;
  lastlogin: string;
  accounts: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage
    ) {
    platform.ready().then(() => {
      // storage.set('password', "aaa");
      Promise.all([ storage.get('password'), storage.get('lastlogin'), storage.get('accounts'), storage.get('endpoint')]).then(values => {
        this.password = values[0];
        this.lastlogin = values[1];
        if (values[2] != null){
          this.accounts = JSON.parse(values[2]);
        }else{
          this.accounts = []
        }
        if (values[3] == null){
          storage.set('endpoint', 'http://nis.imagic.me:4000');
        }

        statusBar.styleDefault();
        splashScreen.hide();

        if (this.password == null || this.password == "") {
          // パスワード未設定の場合はパスワード設定画面
          this.rootPage = PasswordPage;
        } else if (this.lastlogin == null){
          // 未ログインの場合はログイン画面を表示
          this.rootPage = LoginPage;
        } else if (this.accounts.length == 0){
          // ログイン済みだが、アカウント未登録ならアドレス追加画面を表示
          this.rootPage = AddaccountPage;
        } else {
          // ログイン済みで、アカウントも登録済みならホームを表示
          this.rootPage = TabsPage;
        }
      });

    });
  }
}
