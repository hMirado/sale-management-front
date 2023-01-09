import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, iif, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { tokenKey } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { tableStockHeader, tableStockId } from '../../config/constant';
import { AttributeType } from '../../models/attribute-type/attribute-type.model';
import { SerializationType } from '../../models/serialization-type/serialization-type.model';
import { Serialization } from '../../models/serialization/serialization.model';
import { Stock } from '../../models/stock/stock.model';
import { StockService } from '../../services/stock/stock.service';

export interface ISerializationDistinct {
  id: string, 
  value: string[]
}
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  public title: string = 'Stock d\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  
  public uniqueId: string = 'stock-id';

  public tableId: string = tableStockId
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
  
  public stocks: Stock[] = [];
  constructor(
    private notificationService: NotificationService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private helperService: HelperService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.getUserData();
    this.getStocks();
    this.getProductSerialization();
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
    if (id == this.uniqueId) {
      this.getProducts();
      this.getAttributeType();
      this.getSerializationTypes();
    }
  }

  closeModal(id: string) {
    this.modalService.hideModal(id)
  }

  createForm() {
   this.stockFormGroup = this.formBuilder.group({
    item: ['', Validators.required],
    quantity: ['', Validators.required],
    details: this.formBuilder.array([])
   });
  }

  clearForm() {
    this.stockFormGroup.reset();
    this.detailField.clear();
    this.detailField.reset();
  }

  get detailField(): FormArray {
    return this.stockFormGroup.get('details') as FormArray;
  }

  addDetailField() {
    let field = this.formBuilder.group({
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
    let selectedOption = event.option.value;
    this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(selectedOption.toLowerCase()));
    this.isAddAttribute = this.searchProducts[0].is_serializable;
    const quantity = this.stockFormGroup?.get('quantity');
    if (this.isAddAttribute && quantity?.value > 0) {
      this.addDetailField();
      this.addAttributeField(0);
      this.addSerializationField(0);
    } else {
      this.detailField.clear();
      this.detailField.reset();
    }
  }

  getQuantityValueChange() {
    const quantity = this.stockFormGroup?.get('quantity');
     if (quantity?.value > 0 && this.isAddAttribute) {
      for (let i = 0; i < +quantity?.value; i++) {
        this.addDetailField();
        this.addAttributeField(i);
        this.addSerializationField(i);
      }
    } else {
      this.detailField.clear();
      this.detailField.reset();
    }
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
          this.closeModal(this.uniqueId);
          this.getStocks();
        } else {
          this.closeModal(this.uniqueId);
        }
      })
    )
  }

  getStocks() {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page'];
          return iif(() => Boolean(page), this.stockService.getStocks(this.shopUuid, page), this.stockService.getStocks(this.shopUuid))
        })
      ).subscribe((response: ApiResponse) => {
        this.getStockresponse(response);
      })
    )
  }

  getStockresponse(response: ApiResponse) {
    let table: ITable = {
      id: this.tableId,
      header: tableStockHeader,
      body: null
    }
    if (response.status == responseStatus.success) {
      
      this.rows = [];
      this.stocks = response.data;
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
            return this.stockService.getProductSerialization(productUuid, '');
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
      let serialisationDisctinct: ISerializationDistinct[] = []
      for (let index = 0; index < serializationGroup.length; index++) {
        const serializations = serializationGroup[index];
        let data: ISerializationDistinct = {
          id: '',
          value: []
        };
        serializations.forEach((serialization: Serialization) => {
          const attribute_serialization = serialization.attribute_serialization;

          if (attribute_serialization == data.id) {
            data.value.push(`${serialization.serialization_type_label}: ${serialization.serialization_value}`)
          } else {
            data = {
              id: serialization.attribute_serialization as string,
              value: [`${serialization.serialization_type_label}: ${serialization.serialization_value}`]
            }
          }
        })
        serialisationDisctinct.push(data)
      }
      this.serializationValue(serialisationDisctinct);
    }
  }

  serializationValue(values: ISerializationDistinct[]) {
    let rows: IRow[] = []
    values.forEach((value:ISerializationDistinct) => {
      const row = this.stockService.addTableRowSerializationValue(value);
      rows.push(row)
    })
    let cells: ICell = {
      cellValue: rows
    };
    this.tableService.setExpandedValue(cells)
  }
}
