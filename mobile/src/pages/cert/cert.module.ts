import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertPage } from './cert';

@NgModule({
  declarations: [
    CertPage,
  ],
  imports: [
    IonicPageModule.forChild(CertPage),
  ],
})
export class CertPageModule {}
