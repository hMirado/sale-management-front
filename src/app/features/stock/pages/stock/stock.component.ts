import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { ADMIN, authorizations, inputTimer, userInfo } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { ITableFilter, ITableFilterFieldValue, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { TableService } from 'src/app/shared/services/table/table.service';
import { depotShopCode, tableStockHeader } from '../../config/constant';
import { SerializationType } from '../../models/serialization-type/serialization-type.model';
import { Serialization } from '../../models/serialization/serialization.model';
import { Stock } from '../../models/stock/stock.model';
import { StockService } from '../../services/stock/stock.service';
import { Table } from 'src/app/shared/models/table/table.model';
import { Line } from 'src/app/shared/models/table/body/line/line.model';
import { TableauService } from 'src/app/shared/services/table/tableau.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  public title: string = 'Stock d\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public stockId: string = 'stock-id';
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public products: Product[] = [];
  public searchProducts: Product[] = [];
  public stockFormGroup!: FormGroup;
  public formError: boolean = false;
  public isSerializable: boolean = false;
  public attributeTypeLabel: string = "Type d'attribut";
  public serializationTypes: SerializationType[] = [];
  private shopUuid: string = '';
  private shopFilter: string = '';
  private params: any = {}
  public stocks: Stock[] = [];
  public infoBoxStock: IInfoBox[] = [];
  private userData: any;
  public authorizationStockAdd: string = authorizations.stock.element.add;
  public authorizationStockTransfer: string = "authorizations.stock.element.transfer";
  public quantity: number = 0;
  private lines: Line[] = [];
  public sellForm!: FormGroup;

  constructor(
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private helperService: HelperService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private tableFilterService: TableFilterService,
    private authorizationService: AuthorizationService,
    private tableauService: TableauService,
    private notificationService: NotificationService,
  ) {
    this.addHeaderContent();
    this.createForm();
    this.setQueryParams(1, true)
    this.getUserData();
  }

  ngOnInit(): void {
    this.getStocks();
    this.countStock();
    this.getShopFilter();
    this.getExpandedId();
    this.getFilterValue();
    this.cancel();
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
        label: 'Mes stocks d\'articles',
      }
    ]
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
    this.shopFilter = ''
    if (this.userData.role.role_key != ADMIN) {
      this.shopFilter = this.userData.shops[0].shop_uuid;
    }
  }

  openModal(id: string) {
    this.modalService.showModal(id);
    if (id == this.stockId) {
      this.getProducts();
      this.getSerializationTypes();
    }
  }

  closeModal(id: string) {
    this.modalService.hideModal(id);
    this.clearForm();
  }

  createForm() {
   this.stockFormGroup = this.formBuilder.group({
    product: ['', Validators.required],
    shop: ['', Validators.required],
    quantity: ['', Validators.required],
    serializations: this.formBuilder.array([])
   });

   this.sellForm = this.formBuilder.group({
    user: ['', Validators.required],
    shop: ['', Validators.required],
    product: ['', Validators.required],
    serialization: ['', Validators.required],
    price: ['', Validators.required],
    quantity: [1, Validators.required],
   })
  }

  clearForm() {
    this.stockFormGroup.reset();
    this.serializationField.clear();
    this.serializationField.reset();
  }

  resetField() {
    this.serializationField.clear();
    this.serializationField.reset();
  }

  get serializationField(): FormArray {
    return this.stockFormGroup.get('serializations') as FormArray;
  }

  addSerializationField() {
    let field = this.formBuilder.array([])
    this.serializationField.push(field)
  }
  
  getField(i: number): FormArray {
    return this.serializationField.at(i) as FormArray;
  }

  addField(i: number) {
    this.getField(i).push(
      this.formBuilder.group({
        type: ['', Validators.required],
        serialization: ['', Validators.required],
      })
    );
  }

  removeSerializationField(i: number, a: number) {
    this.getField(i).removeAt(a);
  }

  getProducts(){
    this.subscription.add(
      this.stockService.getProducts().subscribe((response: ApiResponse) => {
        switch (response.status) {
          case responseStatus.success:
            this.products = response.data;
            this.searchProducts = response.data;
            break;
        }
      })
    );
  }

  getProductValueChange() {
    const item = this.stockFormGroup?.get('product');
    if (item) {
      this.subscription.add(
        item.valueChanges.pipe(
          distinctUntilChanged((prev, curr)=>{
            return prev.label === curr.label;
          }),
          debounceTime(inputTimer),
          filter(value => (value.length >= 3 || value == '') ),
          switchMap((product: string) => {
            if (product == '') {
             return of(this.products)
            } else {
              this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(product.toLowerCase()));
              const result = this.products.filter(x =>  x.label.toLowerCase().includes(product.toLowerCase()));
              return of(result);
            }
          })
        ).subscribe(response => {
          this.searchProducts = response;
        })
      );
    }
  }

  selectedValue(event: any) {
    this.resetField();
    let selectedOption = event.option.value;
    this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(selectedOption.toLowerCase()));
    this.isSerializable = this.searchProducts[0].is_serializable;
    this.quantity = +this.stockFormGroup?.get('quantity')?.value;
    if (this.isSerializable && this.quantity > 0) {
      this.stockFormGroup;
      this.addSerializationField();
      this.addField(0);
    }
  }

  getQuantityValueChange() {
    this.resetField();
    this.quantity  = this.stockFormGroup?.get('quantity')?.value;
     if (this.quantity > 0 && this.isSerializable) {
      for (let i = 0; i < +this.quantity; i++) {
        this.addSerializationField();
        this.addField(i);
      }
    }
  }

  getSerializationTypes() {
    this.subscription.add(
      this.stockService.getSerializationTypes().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.serializationTypes = response.data;
        }
      })
    );
  }

  addStock() {
    this.shopUuid = this.userData.shops.filter((shop: Shop) => shop.shop_code == depotShopCode)[0].shop_uuid;
    this.stockFormGroup.patchValue({  shop: this.shopUuid });
    this.stockFormGroup.updateValueAndValidity();
    
    if (!this.stockFormGroup.valid) {
      this.formError = true;
    } else {
      this.formError = false;
      this.stockFormGroup.get('product')?.setValue(this?.searchProducts[0].product_uuid)
      this.saveStock(this.stockFormGroup.value)
    }
  }

  saveStock(value: any) {
    this.subscription.add(
      this.stockService.addStock(value).subscribe((response: ApiResponse) => {
        this.clearForm();
        if (response.status == responseStatus.created) {
          this.closeModal(this.stockId);
          this.getStocks();
          this.countStock();
        } else {
          this.closeModal(this.stockId);
        }
      })
    )
  }

  cancel() {
    this.subscription.add(
      this.modalService.isCanceled$.subscribe((status: boolean) => {
        if (status) this.clearForm();
      })
    )
  }

  getStocks(nextPage: number = 1) {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page'];
          let param: any = { 
            paginate: 1,
            page: Boolean(page) ? page: nextPage
          }
          if (this.params['keyword'] && this.params['keyword'] != '' )param['keyword'] = this.params['keyword'];
          if (this.params['status'] && this.params['status'] != 'all' )param['status'] = this.params['status'];
          if (this.params['serialization'] && this.params['serialization'] != 'all' )param['serialization'] = this.params['serialization'];
          return this.stockService.getStocks(this.shopFilter, param)
        })
      ).subscribe((response: ApiResponse) => {
        this.getStockresponse(response);
      })
    )
  }

  getStockresponse(response: ApiResponse) {
    this.lines = [];
    let table: Table = {
      id: this.stockId,
      header: tableStockHeader,
      body: {
        bodyId: 'product-table-body',
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
      this.stocks = response.data.items;
      this.stocks.forEach((stock: Stock, i: number) =>  {
        let line: Line = this.stockService.getTableStock(stock);
        line.column[6] = this.addLineAction(line, stock?.shop?.shop_uuid as string, stock.product?.product_uuid as string);
        this.lines.push(line);
      });
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
    table.body.line = this.lines;
    this.tableauService.setTable(table);
  }

  getProductSerialization() {
    this.subscription.add(
      this.tableService.expandUiid$.pipe(
        switchMap((uuid) => {
          if (uuid && uuid != '') {
            const stock = this.stocks.filter(x => x.stock_uuid == uuid);
            const productUuid = stock[0]?.product?.product_uuid as string;
            
            const shop = this.shopFilter != '' ? this.shopFilter : (this.params['shop'] != '' ? this.params['shop'] : '') 
            return this.stockService.getProductSerialization(productUuid, shop);
          } else {
            return [];
          }
        })
      )
      .subscribe((response: ApiResponse) => {
        this.getProductSerializationResponse(response);
      })
    )
  }

  getExpandedId() {
    this.subscription.add(
      this.tableauService.getExpandedId().pipe(
        filter((id: string) => id != ''),
        switchMap((id: string) => {
          const stock = this.stocks.filter(x => x.stock_uuid == id);
          const productUuid = stock[0]?.product?.product_uuid as string;
          const line = this.lines.filter(x => x.lineId == id)[0];
          const shop = line.column[4].content[0].key.split('/')[1];
          return this.stockService.getProductSerialization(productUuid, shop);
        })
      ).subscribe((response: ApiResponse) => this.getProductSerializationResponse(response))
    );
  }

  getProductSerializationResponse(response: ApiResponse) {
    if (response.status == responseStatus.success) {
      const serializationGroup: Serialization[][] = response.data;
      let serialization: any[] = [];
      for (let index = 0; index < serializationGroup.length; index++) {
        const serializations = serializationGroup[index];
        const value = serializations.map((_serialization: Serialization) => {
          return `${_serialization.label} ${_serialization.serialization_value}`
        });
        serialization.push({
          id: serializations[0].group_id,
          value: value,
          shop: serializations[0]?.shop_uuid,
          product: serializations[0]?.product_uuid,
        })
      }
      this.serializationValue(serialization);
    }
  }

  serializationValue(values: any[]) {
    let lines: Line[] = [];
    values.forEach((value: any) => {
      let line: Line = this.stockService.addTableRowSerializationValue(value);
      line.column[6] = this.addLineAction(line, value['shop'], value['product'], value['id']);
      lines.push(line);
    })
    this.tableauService.setExpandedLineValues(lines);
  }

  addLineAction(line: Line, shop: string, product: string, serialization: string | null = null) {
    let columnAction = line.column[6];
    if (columnAction.content[0].type == 'button') {
      columnAction.content[0].action = () => {this.openSellModal(shop, product, serialization);}
    }
    return columnAction;
  }

  getShopFilter() {
    this.subscription.add(
      this.stockService.getShops().subscribe((response: ApiResponse) => {
        let shopFilter: ITableFilterFieldValue[] = [{
          key: 'all',
          label: 'Tous',
          value: 'all',
          default: true
        }]
        if (response.status == responseStatus.success) {
          const shops = response.data;
          shops.forEach((shop: Shop) => {
            shopFilter.push(
              {
                key: shop.shop_uuid,
                label: shop.shop_name,
                value: shop.shop_uuid
              }
            )
          })
        }
        this.stockFilter(shopFilter);
      })
    );
  }

  stockFilter(shop: ITableFilterFieldValue[]) {
    let stockFilter: ITableFilter = { id: 'stock-filter', title: '', fields: [] }
    const status: ITableFilterFieldValue[] = [
      {
        key: 'all',
        label: 'Tous',
        value: 'all',
        default: true
      },
      {
        key: 'in',
        label: 'En stock',
        value: 'in'
      },
      {
        key: 'out',
        label: 'En rupture',
        value: 'out'
      },
    ];
    const serialization: ITableFilterFieldValue[] = [
      {
        key: 'all',
        label: 'Tous',
        value: 'all',
        default: true
      },
      {
        key: 'yes',
        label: 'Oui',
        value: 'yes'
      },
      {
        key: 'no',
        label: 'Non',
        value: 'no'
      },
    ];

    let _shop: ITableFilterFieldValue[] = []
    if (this.userData.role.role_key == ADMIN) {
      _shop = shop
    }
    
    stockFilter.fields = this.stockService.filter(_shop, status, serialization);
    this.tableFilterService.setFilterData(stockFilter)
  }

  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'stock-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.lines = [];
          this.params['p'] = 0;
          this.params = { ...this.params, ... filter?.value };
          
          return this.stockService.getStocks(this.shopFilter, this.params)
        })
      ).subscribe((response: ApiResponse) => this.getStockresponse(response))
    )
  }

  countStock() {
    this.subscription.add(
      this.stockService.countStock().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.infoBoxStock = [
              {
              id: 'in-stock',
              bg: 'bg-info',
              icon: ' fa-shopping-bag',
              number: response.data.in,
              text: 'En stock'
            },{
              id: 'out-stock',
              bg: 'bg-danger',
              icon: ' fa-exclamation',
              number: response.data.out,
              text: 'En rupture'
            }
          ]
        }
      })
    )
  }

  getAuthorization(key: string) {
    return this.authorizationService.getAuthorization(key)
  }

  setQueryParams(page: number = 1, init: boolean = false){
    let qParams: Params = {};
    if (init) {
      qParams = {}
    } else {
      qParams['page'] = page
      if (this.params['keyword'] && this.params['keyword'] != '' )qParams['keyword'] = this.params['keyword'];
      if (this.params['status'] && this.params['status'] != 'all' )qParams['status'] = this.params['status'];
      if (this.params['serialization'] && this.params['serialization'] != 'all' )qParams['serialization'] = this.params['serialization'];
    }

    this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: qParams,
        queryParamsHandling: ''
    });
  }

  openSellModal(shop: string, product: string, serialization: string | null = null) {
    this.sellForm.patchValue(
      {
        user: this.userData.user_uuid,
        shop: shop,
        product: product,
        serialization: serialization,
        quantity: 1
      }
    )
    this.openModal('sell');
  }

  sellProduct() {
    this.subscription.add(
      this.stockService.saleProductInStock(this.sellForm.value).subscribe((response: ApiResponse) => {
        this.closeModal('sell');
        this.showNotification('success', response.notification);
        this.getStocks(this.currentPage);
      })
    );
  }

  inputIsDisabled(value: any): boolean {
    return value || value != null ? true : false;
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
