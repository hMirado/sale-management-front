import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter, switchMap } from 'rxjs';
import { authorizations, userInfo } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { Line } from 'src/app/shared/models/table/body/line/line.model';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { TableauService } from 'src/app/shared/services/table/tableau.service';
import { SaleService } from '../../services/sale/sale.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { ITableFilter } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { Table } from 'src/app/shared/models/table/table.model';
import { tableSaleHeader } from '../../config/constant';
import { responseStatus } from 'src/app/core/config/constant';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Serialization } from 'src/app/features/stock/models/serialization/serialization.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public title: string = 'Ventes';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  private userData: any;
  public boxDatas: IInfoBox[] = [
    {
      id: 'item',
      bg: 'bg-success',
      icon: 'fas fa-coins',
      number: 20000000,
      text: 'Chiffres d\'affaires'
    },
    {
      id: 'item',
      bg: 'bg-info',
      icon: 'fas fa-shopping-bag',
      number: 20,
      text: 'Articles'
    }
  ];
  private lines: Line[] = [];

  constructor(
    private tableService: TableauService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private authorizationService: AuthorizationService,
    private saleSerice: SaleService,
    private tableFilterService: TableFilterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.getUserData();
    // this.setQueryParams(1, true)
  }

  ngOnInit(): void {
    this.addHeaderContent();
    this.getStatistique();
    this.setFilter();
    this.getSales();
    this.getLineId();
  }

  ngOnDestroy(): void {
    this.helperService.reset();
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Mes ventes',
      }
    ]
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
  }

  getAuthorization(key: string) {
    return this.authorizationService.getAuthorization(key)
  }

  getStatistique() {
    const isAuthorized = this.getAuthorization(authorizations.shop.element.multipleAction);
    const shop = isAuthorized ? null : this.userData.shops[0].shop_uuid;
    this.subscription.add(
      this.saleSerice.getCountSale(shop).subscribe((response: ApiResponse) => {
        const value = response.data;
        this.boxDatas[0].number = this.helperService.numberFormat(value.sales / 100);
        this.boxDatas[1].number = this.helperService.numberFormat(value.quantities);
      })
    );
  }

  setFilter() {
    const filter: ITableFilter = {
      id: 'sale',
      title: '',
      fields: [
        {
          key: 'keyword',
          label: "Mots clé",
          type: 'input',
          placeholder: 'Article / Code article'
        }
      ]
    }
    this.tableFilterService.setFilterData(filter);
  }

  private params: any = {};
  getSales() {
    const isAuthorized = this.getAuthorization(authorizations.shop.element.multipleAction);
    this.params['shop'] = isAuthorized ? null : this.userData.shops[0].shop_uuid;;
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          this.params['page']= params['page'];
          return this.saleSerice.getSales(this.params)
        })
      ).subscribe((response: ApiResponse) => this.getSalesResponse(response))
    );
  }
  
  getSalesResponse(response: ApiResponse) {
    this.lines = [];
    let table: Table = {
      id: 'sale',
      header: tableSaleHeader,
      body: {
        bodyId: 'sale-table-body',
        line: []
      },
      action: {
        isParent: false,
        isChild: false,
        delete: false,
        edit: false
      }
    }

    if (response.status == responseStatus.success) {      
      const sales = response.data.items;
      sales.forEach((sale: any) => {
        this.lines.push(this.saleSerice.getSaleTable(sale));
      })
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = +response.data.totalItems <= this.currentPage*sales.length ? this.currentPage : this.currentPage + 1;
      this.totalItems = response.data.totalItems;
    }

    table.body.line = this.lines;
    this.tableService.setTable(table);
  }

  setQueryParams(page: number = 1, init: boolean = false){
    let qParams: Params = {};
    if (init) {
      qParams = {}
    } else {
      qParams['page'] = page
      if (this.params['keyword'] && this.params['keyword'] != '' )qParams['keyword'] = this.params['keyword'];
      if (this.params['shop'] && this.params['shop'] != 'all' )qParams['shop'] = this.params['shop'];
      if (this.params['category'] && this.params['category'] != 'all' )qParams['category'] = this.params['category'];
    }

    this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: qParams,
        queryParamsHandling: ''
    });
  }

  getLineId(): void {
    let lineId: string = '';
    this.subscription.add(
      this.tableService.getExpandedId()
      .pipe(
        filter((value: string) => value != ''),
        switchMap((value: string) => {
          const serializationGroup = value.split('|')[1];
          lineId = value;
          return this.saleSerice.getSelledProductSerializtion(serializationGroup);
        })
      )
      .subscribe((response: ApiResponse) => {
        let lines: Line[] = []
        response.data.forEach((data: any, i: number) => {
          let serializations: any = [];
          data.forEach((serialization: Serialization) => {
            serializations.push(`${serialization.serialization_type?.label} : ${serialization.serialization_value}`);
          });
          lines.push(this.saleSerice.getSerializationLine(lineId, serializations));
        });
        this.tableService.setExpandedLineValues(lines);
      })
    );
  }
}