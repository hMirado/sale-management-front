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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryComponent } from './components/category/category.component';

@NgModule({
  declarations: [
    SaleComponent,
    CatalogComponent,
    CustomerComponent,
    SearchComponent,
    CartComponent,
    ProductComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class SaleModule { }
