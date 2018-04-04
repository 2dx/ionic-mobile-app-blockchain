import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultisigPage } from './multisig';

@NgModule({
  declarations: [
    MultisigPage,
  ],
  imports: [
    IonicPageModule.forChild(MultisigPage),
  ],
})
export class MultisigPageModule {}
