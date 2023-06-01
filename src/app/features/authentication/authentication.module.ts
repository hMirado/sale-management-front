import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ]
})
export class AuthenticationModule { }
