import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './pages/stock/stock.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
  
    StockComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule
  ]
})
export class StockModule { }
