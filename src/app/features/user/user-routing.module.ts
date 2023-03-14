import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from 'src/app/core/core.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication/authentication.guard';
import { CreateComponent } from './pages/create/create.component';
import { ListComponent } from './pages/list/list.component';

const routes: Routes = [
  {
    path:'',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: ListComponent
      },
      {
        path: 'create',
        component: CreateComponent
      },
      {
        path: '**',
        redirectTo : ''
      },
    ],
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
