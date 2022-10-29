import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IExport } from 'src/app/shared/models/export/i-export';
import { IImport } from 'src/app/shared/models/import/i-import';
import { ExportService } from 'src/app/shared/serives/export/export.service';
import { FileService } from 'src/app/shared/serives/file/file.service';
import { ImportService } from 'src/app/shared/serives/import/import.service';
import { exportCategoryConfig, impportCategoryConfig } from '../../config/constant';
import { CategoryService } from '../../service/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  public title: string = 'Catégories d\articles';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public importConfig: IImport = impportCategoryConfig;
  public exportConfig: IExport = exportCategoryConfig;
  public uniqueId: string = 'category-id';
  public categoryNumber: number = 0;

  constructor(
    private fileService: FileService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.importFile();
    this.exportFile();
    this.countCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Catalogues',
      },
      {
        url: '',
        label: 'Catégories d\'articles'
      }
    ]
  }

  importFile() {
    this.subscription.add(
      this.fileService.base64File$.pipe(
        switchMap((file: string|ArrayBuffer|null) => {
          if (file) return this.categoryService.importCategory (file);
          else return[]
        })
      )
      .subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.showNotification('success', response.notification);
          this.countCategories();
        }
      })
    );
  }

  exportFile() {
    this.subscription.add(
      this.exportService.isExport$.pipe(
        switchMap((value: boolean) => {
          if (value) {
            return this.categoryService.exportModel()
          }
          else return []
        })
      ).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          let blob = this.fileService.convertBase64ToBlob(response.data.file);
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = this.exportConfig.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
    )
  }

  countCategories() {
    this.subscription.add(
      this.categoryService.countCategories().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.categoryNumber = response.data;
        }
      })
    );
  }


  /**
   * @description Notification
   * @param type 
   * @param message 
   */
   showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
