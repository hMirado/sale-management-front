import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication/authentication.guard';
import { SaleComponent } from './page/sale/sale.component';
import { ListComponent } from './page/list/list.component';
import { CoreComponent } from 'src/app/core/core.component';

const routes: Routes = [
  {
    path: '',
    component: SaleComponent,
    canActivate: [AuthenticationGuard]
  },
  
  {
    path: 'list',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: ListComponent
      }
    ],
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
