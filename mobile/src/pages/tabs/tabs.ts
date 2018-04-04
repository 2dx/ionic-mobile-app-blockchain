import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SendPage } from '../send/send';
import { CertPage } from '../cert/cert';
import { QrPage } from '../qr/qr';
import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SendPage;
  tab3Root = CertPage;
  tab4Root = QrPage;
  tab5Root = SettingPage;

  constructor() {

  }
}
