import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedGuard } from './guard/is-logged.guard';
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [ IsLoggedGuard ]
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [ IsLoggedGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
