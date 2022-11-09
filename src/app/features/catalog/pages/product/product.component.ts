import { Component, OnDestroy, OnInit } from '@angular/core';
import {iif, Subscription, switchMap} from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IExport } from 'src/app/shared/models/export/i-export';
import { IBase64File } from 'src/app/shared/models/file/i-base64-file';
import { IImport } from 'src/app/shared/models/import/i-import';
import { ExportService } from 'src/app/shared/serives/export/export.service';
import { FileService } from 'src/app/shared/serives/file/file.service';
import {exportProductConfig, impportProductConfig, tableProductHeader, tableProductId} from '../../config/constant';
import { ProductService } from '../../service/product/product.service';
import {ActivatedRoute, Params} from "@angular/router";
import {TableService} from "../../../../shared/serives/table/table.service";
import {ICell, IRow, ITable} from "../../../../shared/models/table/i-table";
import {Category} from "../../models/category/category.model";
import {Product} from "../../models/product/product.model";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  public title: string = 'Articles';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public productNumber: number = 0;

  public uniqueIdProduct: string = 'product-id';
  public importProduct: IImport = impportProductConfig;
  public exportProduct: IExport = exportProductConfig;

  public tableId: string = tableProductId;
  private rows: IRow[] = [];

  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  constructor(
    private fileService: FileService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private exportService: ExportService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.importFile();
    this.exportFile();
    this.countProduct();
    this.getProducts();
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
        label: 'Articles'
      }
    ]
  }

  importFile() {
    this.subscription.add(
      this.fileService.base64File$.pipe(
        switchMap((data: IBase64File) => {
          if (data.id == this.uniqueIdProduct && data.file != '') return this.productService.importProduct(data.file);
          else return[]
        })
      )
      .subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.showNotification('success', response.notification);
        }
      })
    );
  }

  exportFile() {
    this.subscription.add(
      this.exportService.isExport$.pipe(
        switchMap((value: boolean) => {
          if (value) {
            return this.productService.exportModel()
          }
          else return []
        })
      ).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          let blob = this.fileService.convertBase64ToBlob(response.data.file);
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = this.exportProduct.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
    )
  }

  countProduct() {
    this.subscription.add(
      this.productService.countProduct().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.productNumber = response.data;
        }
      })
    );
  }

  getProducts() {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page']
          return iif(() => Boolean(page), this.productService.getProducts(page), this.productService.getProducts())
        })
      ).subscribe((response: ApiResponse) => this.getProductsResponse(response))
    );
  }

  getProductsResponse(response: ApiResponse) {
    console.log(response)
    let table: ITable = {
      id: this.tableId,
      header: [],
      body: null
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      let products: Product[] = response.data.items;
      products.forEach((product: Product) => {
        let row: IRow = this.productService.addTableRowValue(product);
        this.rows.push(row);
      });
      let cells: ICell = {
        cellValue: this.rows,
        isEditable: true,
        isDeleteable: true,
        isSwitchable: true
      };
      table.header = tableProductHeader;
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
}
