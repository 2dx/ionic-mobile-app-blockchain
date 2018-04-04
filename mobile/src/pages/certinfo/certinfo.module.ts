import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertinfoPage } from './certinfo';

@NgModule({
  declarations: [
    CertinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CertinfoPage),
  ],
})
export class CertinfoPageModule {}
