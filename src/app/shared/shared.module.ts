import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonLeftMenuComponent } from './components/button-left-menu/button-left-menu.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { ToDoComponent } from './components/to-do/to-do.component';
import { ImportComponent } from './components/files/import/import.component';
import { ExportComponent } from './components/files/export/export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
import { CardButtonComponent } from './components/card-button/card-button.component';
import { ModalComponent } from './components/modal/modal.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tabs/tab/tab.component';
import { RouterModule } from '@angular/router';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationComponent } from '../core/components/notification/notification.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { ItemSelectionComponent } from './components/item-selection/item-selection.component';
import { NumberComponent } from './components/input/number/number.component';
import { TextComponent } from './components/input/text/text.component';
import { CheckboxComponent } from './components/input/checkbox/checkbox.component';
import { ButtonComponent } from './components/button/button.component';
import { TableauComponent } from './components/tableau/tableau.component';
import { SmallBoxComponent } from './components/small-box/small-box.component';
import { ErrorComponent } from './components/files/error/error.component';
import { ConfirmComponent } from './components/files/confirm/confirm.component';
import { ResultComponent } from './components/files/result/result.component';

@NgModule({
  declarations: [
    ButtonLeftMenuComponent,
    BreadCrumbComponent,
    PageTitleComponent,
    ContentHeaderComponent,
    ToDoComponent,
    ImportComponent,
    ExportComponent,
    TableComponent,
    FilterComponent,
    CardButtonComponent,
    ModalComponent,
    InfoBoxComponent,
    TabsComponent,
    TabComponent,
    TableFilterComponent,
    NotificationComponent,
    TooltipComponent,
    ItemSelectionComponent,
    NumberComponent,
    TextComponent,
    CheckboxComponent,
    ButtonComponent,
    TableauComponent,
    SmallBoxComponent,
    ErrorComponent,
    ConfirmComponent,
    ResultComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    ButtonLeftMenuComponent,
    BreadCrumbComponent,
    PageTitleComponent,
    ContentHeaderComponent,
    ToDoComponent,
    ImportComponent,
    ExportComponent,
    TableComponent,
    CardButtonComponent,
    ModalComponent,
    InfoBoxComponent,
    TabsComponent,
    TabComponent,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule,
    TableFilterComponent,
    MatDividerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NotificationComponent,
    MatStepperModule,
    MatCheckboxModule,
    TooltipComponent,
    ItemSelectionComponent,
    NumberComponent,
    TextComponent,
    CheckboxComponent,
    ButtonComponent,
    TableauComponent,
    SmallBoxComponent,
    ErrorComponent,
    ConfirmComponent,
    ResultComponent
  ]
})
export class SharedModule { }
