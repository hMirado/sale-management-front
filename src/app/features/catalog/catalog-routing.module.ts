import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from 'src/app/core/core.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication/authentication.guard';
import { ListComponent as CategoryListComponent } from './pages/category/list/list.component';
import { ListComponent as ProductListComponent } from './pages/product/list/list.component';
import { DetailComponent as ProductDetailComponent } from './pages/product/detail/detail.component';

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
            component: ProductListComponent
          },
          {
            path: 'detail/:uuid',
            component: ProductDetailComponent
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
