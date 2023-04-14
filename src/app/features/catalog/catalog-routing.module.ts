import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from 'src/app/core/core.component';
import { ProductComponent } from './pages/product/product.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication/authentication.guard';
import { DetailComponent } from './detail/detail.component';
import { ListComponent as CategoryListComponent } from './pages/category/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'category',
        children: [
          {
            path: '',
            component: CategoryListComponent
          }, 
          {
            path: ':uuid',
            component: DetailComponent
          },
          {
            path: '**',
            redirectTo : ''
          },
        ]
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            component: ProductComponent
          },
          {
            path: '/:uuid'
          },
          {
            path: '**',
            redirectTo : ''
          },
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
