import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AuthenticationModule { }
