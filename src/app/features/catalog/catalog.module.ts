import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { ProductComponent } from './pages/product/product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DetailComponent as CategoryDetailComponent } from './detail/detail.component';
import { ListComponent as CategoryListComponent } from './pages/category/list/list.component';

@NgModule({
  declarations: [
    ProductComponent,
    CategoryDetailComponent,
    CategoryListComponent,
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
