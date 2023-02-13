import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, iif, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { tokenKey } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { ITableFilter, ITableFilterFieldValue, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TabService } from 'src/app/shared/serives/tab/tab.service';
import { TableFilterService } from 'src/app/shared/serives/table-filter/table-filter.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { tableStockHeader, tableStockId } from '../../config/constant';
import { AttributeType } from '../../models/attribute-type/attribute-type.model';
import { SerializationType } from '../../models/serialization-type/serialization-type.model';
import { Serialization } from '../../models/serialization/serialization.model';
import { Stock } from '../../models/stock/stock.model';
import { StockService } from '../../services/stock/stock.service';

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
  public transferId: string = 'transfer-id';
  public tableId: string = tableStockId;
  private rows: IRow[] = [];
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public products: Product[] = [];
  public searchProducts: Product[] = [];
  public stockFormGroup!: FormGroup;
  public formError: boolean = false;
  public isAddAttribute: boolean = false;
  public attributeTypes: AttributeType[] = [];
  public attributeTypeLabel: string = "Type d'attribut";
  public serializationTypes: SerializationType[] = [];
  private shopUuid: string = '';
  private shopFilter: string = '';
  private params: any = {}
  public stocks: Stock[] = [];
  public infoBoxStock: IInfoBox[] = [];

  constructor(
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private helperService: HelperService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private tableFilterService: TableFilterService,
    private tabService: TabService
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.getUserData();
    this.getTab();
    this.getProductSerialization();
    this.getShopFilter();
    this.getFilterValue();
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
    const token = this.localStorageService.getLocalStorage(tokenKey);
    const decodedToken = this.helperService.decodeJwtToken(token);
    this.shopUuid = decodedToken.user.shop.shop_uuid;
  }

  openModal(id: string) {
    this.modalService.showModal(id);
    if (id == this.stockId) {
      this.getProducts();
      this.getAttributeType();
      this.getSerializationTypes();
    }
  }

  closeModal(id: string) {
    this.modalService.hideModal(id);
    this.clearForm();
  }

  createForm() {
   this.stockFormGroup = this.formBuilder.group({
    item: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
    details: this.formBuilder.array([])
   });
  }

  clearForm() {
    this.stockFormGroup.reset();
    this.detailField.clear();
    this.detailField.reset();
  }

  resetField() {
    this.detailField.clear();
    this.detailField.reset();
  }

  get detailField(): FormArray {
    return this.stockFormGroup.get('details') as FormArray;
  }

  addDetailField() {
    let field = this.formBuilder.group({
      price: ['', Validators.required],
      attributes:  this.formBuilder.array([]),
      serializations:  this.formBuilder.array([]),
    });
    this.detailField.push(field)
  }

  removeDetailField(i: number) {
    this.detailField.removeAt(i);
  }

  getDetailAttributeField(i: number): FormArray {
    return this.detailField.at(i).get('attributes') as FormArray;
  }

  addAttributeField(i: number) {
    this.getDetailAttributeField(i).push(
      this.formBuilder.group({
        attribute_type: ['', Validators.required],
        attribute: ['', Validators.required],
        id: i
      })
    );
  }

  removeAttributeField(i: number, a: number) {
    this.getDetailAttributeField(i).removeAt(a);
  }
  
  getDetailSerializationField(i: number): FormArray {
    return this.detailField.at(i).get('serializations') as FormArray;
  }

  addSerializationField(i: number) {
    this.getDetailSerializationField(i).push(
      this.formBuilder.group({
        type: ['', Validators.required],
        value: ['', Validators.required],
        id: i
      })
    );
  }

  removeSerializationField(i: number, a: number) {
    this.getDetailSerializationField(i).removeAt(a);
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
    const item = this.stockFormGroup?.get('item');
    if (item) {
      this.subscription.add(
        item.valueChanges.pipe(
          distinctUntilChanged((prev, curr)=>{
            return prev.label === curr.label;
          }),
          debounceTime(500),
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
    this.addPriceValidator();
    let selectedOption = event.option.value;
    this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(selectedOption.toLowerCase()));
    this.isAddAttribute = this.searchProducts[0].is_serializable;
    const quantity = this.stockFormGroup?.get('quantity');
    if (this.isAddAttribute && quantity?.value > 0) {
      this.stockFormGroup
      this.addDetailField();
      this.addAttributeField(0);
      this.addSerializationField(0);
      this.removePriceValidator();
    }
  }

  getQuantityValueChange() {
    this.resetField();
    this.addPriceValidator();
    const quantity = this.stockFormGroup?.get('quantity');
     if (quantity?.value > 0 && this.isAddAttribute) {
      this.removePriceValidator();
      for (let i = 0; i < +quantity?.value; i++) {
        this.addDetailField();
        this.addAttributeField(i);
        this.addSerializationField(i);
      }
    }
  }

  removePriceValidator() {
    this.stockFormGroup?.get('price')?.clearValidators();
    this.stockFormGroup?.get('price')?.updateValueAndValidity();
  }

  addPriceValidator() {
    this.stockFormGroup?.get('price')?.setValidators([Validators.required]);
    this.stockFormGroup?.get('price')?.updateValueAndValidity();
  }

  getAttributeType() {
    this.subscription.add(
      this.stockService.getAttributeTypes().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.attributeTypes = response.data;
        }
      })
    )
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
    if (!this.stockFormGroup.valid) {
      this.formError = true;
    } else {
      this.formError = false;
      this.stockFormGroup.patchValue({'item': this?.searchProducts[0].product_id});
      this.stockFormGroup.updateValueAndValidity();
      this.saveStock(this.stockFormGroup.value)
    }
  }

  saveStock(value: any) {
    this.subscription.add(
      this.stockService.addStock(value, this.shopUuid).subscribe((response: ApiResponse) => {
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

  getTab() {
    this.subscription.add(
      this.tabService.getTab().subscribe(tabId => {
        if (tabId == this.stockId) {
          this.getStocks();
          this.countStock();
          this.getShopFilter();
        }
      })
    );
  }

  getStocks(nextPage: number = 1, _params: any = {}) {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page'];
          let param: any = { 
            paginate: 1,
            page: Boolean(page) ? page: nextPage
          }
          if (_params['keyword'] && _params['keyword'] != '' )param['keyword'] = _params['keyword'];
          if (_params['status'] && _params['status'] != 'all' )param['status'] = _params['status'];
          if (_params['serialization'] && _params['serialization'] != 'all' )param['serialization'] = _params['serialization'];
          return this.stockService.getStocks(this.shopFilter, param)
        })
      ).subscribe((response: ApiResponse) => {
        this.getStockresponse(response);
      })
    )
  }

  getStockresponse(response: ApiResponse) {
    console.log(response);
    
    let table: ITable = {
      id: this.tableId,
      header: tableStockHeader,
      body: null
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      this.stocks = response.data.items;
      this.stocks.forEach((stock: Stock) =>  {
        let row: IRow = this.stockService.addTableRowValue(stock);
        this.rows.push(row);
      })
      
      let cells: ICell = {
        cellValue: this.rows,
        isEditable: false,
        isDeleteable: false,
        isSwitchable: false
      }
      table.body = cells;
      this.tableService.setTableValue(table);
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
  }

  getProductSerialization() {
    this.subscription.add(
      this.tableService.expandUiid$.pipe(
        switchMap((uuid) => {
          if (uuid && uuid != '') {
            const stock = this.stocks.filter(x => x.stock_uuid == uuid);
            const productUuid = stock[0]?.product?.product_uuid as string;
            return this.stockService.getProductSerialization(productUuid, stock[0].shop?.shop_uuid);
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

  getProductSerializationResponse(response: ApiResponse) {
    if (response.status == responseStatus.success) {
      const serializationGroup: Serialization[][] = response.data
      let serialisationDisctinct: any[] = []
      for (let index = 0; index < serializationGroup.length; index++) {
        const serializations = serializationGroup[index];
        let data: any = {};
        serializations.forEach((serialization: Serialization) => {
          const attribute_serialization = serialization.attribute_serialization;
          const _serialization = serialization.serialization_type_label + ': ' + serialization.serialization_value
          const value = {
            uniqueId: attribute_serialization,
            value: [_serialization]
          }
          if (data['uniqueId'] != attribute_serialization) {
            data = value
          } else {
            data['value'].push(_serialization);
          }
        })
        serialisationDisctinct.push(data)
      }
      this.serializationValue(serialisationDisctinct);
    }
  }

  serializationValue(values: any[]) {
    let rows: IRow[] = []
    values.forEach((value: any) => {
      const row = this.stockService.addTableRowSerializationValue(value);
      rows.push(row)
    })
    let cells: ICell = {
      cellValue: rows
    };
    this.tableService.setExpandedValue(cells)
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

    stockFilter.fields = this.stockService.filter(shop, status, serialization);
    this.tableFilterService.setFilterData(stockFilter)
  }

  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'stock-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.rows = []
          this.params['p'] = 0
          filter?.value.forEach((value, i) => {
            this.params[Object.keys(value)[0]] = value[Object.keys(value)[0]]
          })
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
              text: 'Article en stock'
            },{
              id: 'out-stock',
              bg: 'bg-danger',
              icon: ' fa-exclamation',
              number: response.data.out,
              text: 'Article en rupture'
            }
          ]
        }
      })
    )
  }
}
