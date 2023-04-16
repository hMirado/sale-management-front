import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ListComponent as CategoryListComponent } from './pages/category/list/list.component';
import { ListComponent as ProductListComponent } from './pages/product/list/list.component';
import { DetailComponent as ProductDetailComponent } from './pages/product/detail/detail.component';
import { InformationComponent } from './components/product/information/information.component';
import { PriceComponent } from './components/product/price/price.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    ProductListComponent,
    ProductDetailComponent,
    InformationComponent,
    PriceComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ]
})
export class CatalogModule { }
