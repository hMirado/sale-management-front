import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonLeftMenuComponent } from './components/button-left-menu/button-left-menu.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ToDoComponent } from './components/to-do/to-do.component';
import { ImportComponent } from './components/files/import/import.component';
import { ExportComponent } from './components/files/export/export.component';
import { BoxSummaryComponent } from './components/box-summary/box-summary.component';



@NgModule({
  declarations: [
    ButtonLeftMenuComponent,
    BreadCrumbComponent,
    PageTitleComponent,
    ContentHeaderComponent,
    NotificationComponent,
    ToDoComponent,
    ImportComponent,
    ExportComponent,
    BoxSummaryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonLeftMenuComponent,
    BreadCrumbComponent,
    PageTitleComponent,
    ContentHeaderComponent,
    ToDoComponent,
    ImportComponent,
    ExportComponent
  ]
})
export class SharedModule { }
