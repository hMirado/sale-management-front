import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonLeftMenuComponent } from './components/button-left-menu/button-left-menu.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { ToDoComponent } from './components/to-do/to-do.component';
import { ImportComponent } from './components/files/import/import.component';
import { ExportComponent } from './components/files/export/export.component';
import { BoxSummaryComponent } from './components/box-summary/box-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
import { CardButtonComponent } from './components/card-button/card-button.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    ButtonLeftMenuComponent,
    BreadCrumbComponent,
    PageTitleComponent,
    ContentHeaderComponent,
    ToDoComponent,
    ImportComponent,
    ExportComponent,
    BoxSummaryComponent,
    TableComponent,
    FilterComponent,
    CardButtonComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    ModalComponent
  ]
})
export class SharedModule { }
