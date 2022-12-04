import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './page/sale/sale.component';
import { SaleRoutingModule } from './sale-routing.module';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CustomerComponent } from './components/customer/customer.component';
import { SearchComponent } from './components/search/search.component';
import { CartComponent } from './components/cart/cart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductComponent } from './components/catalog/product/product.component';



@NgModule({
  declarations: [
    SaleComponent,
    CatalogComponent,
    CustomerComponent,
    SearchComponent,
    CartComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    SharedModule
  ]
})
export class SaleModule { }
