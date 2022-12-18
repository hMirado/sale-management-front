import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(home => home.HomeModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./features/setting/setting.module').then(setting => setting.SettingModule)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./features/catalog/catalog.module').then(catalog => catalog.CatalogModule)
  },
  {
    path: 'sale',
    loadChildren: () => import('./features/sale/sale.module').then(sale => sale.SaleModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('./features/authentication/authentication.module').then(authentication => authentication.AuthenticationModule)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
