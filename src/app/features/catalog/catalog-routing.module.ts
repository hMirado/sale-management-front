import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from 'src/app/core/core.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { CreateComponent as ProductCreateComponent } from './pages/product/create/create.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            component: ProductComponent
          },
          {
            path: 'create',
            component: ProductCreateComponent
          },
          {
            path: 'edit/:uuid',
            component: ProductCreateComponent
          }
        ]
      }
    ],
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
