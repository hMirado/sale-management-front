import { Component, OnDestroy, OnInit } from '@angular/core';
import {iif, Subscription, switchMap} from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IExport } from 'src/app/shared/models/export/i-export';
import { IBase64File } from 'src/app/shared/models/file/i-base64-file';
import { IImport } from 'src/app/shared/models/import/i-import';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { ExportService } from 'src/app/shared/serives/export/export.service';
import { FileService } from 'src/app/shared/serives/file/file.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import {exportCategoryConfig, impportCategoryConfig, tableCategoryHeader, tableCategoryId} from '../../config/constant';
import { Category } from '../../models/category/category.model';
import { CategoryService } from '../../service/category/category.service';
import {ActivatedRoute, Params} from "@angular/router";
import { IFilterFieldValue } from 'src/app/shared/models/i-filter/i-filter-field-value';
import { IFilter } from 'src/app/shared/models/i-filter/i-filter';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  public title: string = 'Catégories d\articles';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public categoryNumber: number = 0;

  public importConfig: IImport = impportCategoryConfig;
  public exportConfig: IExport = exportCategoryConfig;
  public uniqueId: string = 'category-id';

  public tableId: string = tableCategoryId
  private rows: IRow[] = [];

  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  constructor(
    private fileService: FileService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private exportService: ExportService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.importFile();
    this.exportFile();
    this.countCategories();
    this.getCategories();
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
        switchMap((data: IBase64File) => {
          if (data.id == this.uniqueId && data.file) return this.categoryService.importCategory(data.file);
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

  getCategories() {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page']
          return iif(() => Boolean(page), this.categoryService.getCategories(page), this.categoryService.getCategories())
        })
      ).subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
    )
  }

  getCategoriesResponse(response: ApiResponse) {
    let table: ITable = {
      id: this.tableId,
      header: [],
      body: null
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      let categories: Category[] = response.data.items;
      categories.forEach((category: Category) => {
        let row: IRow = this.categoryService.addTableRowValue(category);
        this.rows.push(row);
      });
      let cells: ICell = {
        cellValue: this.rows,
        isEditable: true,
        isDeleteable: true,
        isSwitchable: true
      };
      table.header = tableCategoryHeader;
      table.body = cells;
      this.tableService.setTableValue(table);
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
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

  addFilterValue() {
    const filter: IFilter = {
      title: '',
      fields: [
        {
          key: 'search',
          label: 'Libéllé ou code article',
          type: 'input'
        }
      ]
    }
  }
}
