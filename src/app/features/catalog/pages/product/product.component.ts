import { Component, OnDestroy, OnInit } from '@angular/core';
import {iif, Subscription, switchMap} from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import {  tableProductHeader, tableProductId } from '../../config/constant';
import { ProductService } from '../../service/product/product.service';
import {ActivatedRoute, Params} from "@angular/router";
import {TableService} from "../../../../shared/serives/table/table.service";
import {ICell, IRow, ITable} from "../../../../shared/models/table/i-table";
import {Product} from "../../models/product/product.model";
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';

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
  public tableId: string = tableProductId;
  private rows: IRow[] = [];
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public infoBoxProductCount!: IInfoBox;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.countProduct();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.helperService.reset();
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil',
      },
      {
        label: 'Catalogues',
      },
      {
        label: 'Articles'
      }
    ]
  }

  countProduct() {
    this.subscription.add(
      this.productService.countProduct().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.productNumber = response.data;
          this.infoBoxProductCount =  {
            bg: 'bg-info',
            number: this.productNumber,
            text: 'Total article(s)'
          }
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

  goToCreateItem() {

  }
}
