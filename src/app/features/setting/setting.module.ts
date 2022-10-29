import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { ShopComponent } from './pages/shop/shop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListComponent } from './components/shop/list/list.component';

@NgModule({
  declarations: [
    ShopComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ]
})
export class SettingModule { }
