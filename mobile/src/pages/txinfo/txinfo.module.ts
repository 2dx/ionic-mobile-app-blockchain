import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TxinfoPage } from './txinfo';

@NgModule({
  declarations: [
    TxinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(TxinfoPage),
  ],
})
export class TxinfoPageModule {}
