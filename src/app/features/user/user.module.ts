import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { InfoFormComponent } from './components/info-form/info-form.component';
import { ShopFormComponent } from './components/shop-form/shop-form.component';
import { EditComponent } from './pages/edit/edit.component';
import { ShopFormComponent as ShopFormEditComponent } from './components/edit/shop-form/shop-form.component';
import { ProfilComponent } from './components/edit/profil/profil.component';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    InfoFormComponent,
    ShopFormComponent,
    EditComponent,
    ShopFormEditComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class UserModule { }
