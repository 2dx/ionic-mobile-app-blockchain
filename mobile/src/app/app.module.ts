import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SendPage } from '../pages/send/send';
import { CertPage } from '../pages/cert/cert';
import { QrPage } from '../pages/qr/qr';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { AddaccountPage } from '../pages/addaccount/addaccount';
import { PasswordPageModule } from '../pages/password/password.module';
import { PasswordPage } from '../pages/password/password';
import { CertinfoPage } from '../pages/certinfo/certinfo';
import { TxinfoPage } from '../pages/txinfo/txinfo';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { CryptoProvider } from '../providers/crypto/crypto';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SendPage,
    CertPage,
    QrPage,
    SettingPage,
    TabsPage,
    LoginPage,
    AddaccountPage,
    CertinfoPage,
    TxinfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    NgxQRCodeModule,
    PasswordPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SendPage,
    CertPage,
    QrPage,
    SettingPage,
    TabsPage,
    LoginPage,
    AddaccountPage,
    PasswordPage,
    CertinfoPage,
    TxinfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CryptoProvider
  ]
})
export class AppModule {}
