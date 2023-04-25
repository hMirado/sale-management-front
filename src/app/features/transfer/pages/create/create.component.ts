import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, filter, map, of, single, startWith, switchMap } from 'rxjs';
import { userInfo } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { TransferService } from '../../services/transfer/transfer.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { ICell, IRow, ITable, InputValue } from 'src/app/shared/models/table/i-table';
import { tableProductHeader } from '../../config/constant';
import { TableService } from 'src/app/shared/services/table/table.service';
import { ItemSelectionService } from 'src/app/shared/services/item-selection/item-selection.service';
import { ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Product as TransfertProduct } from '../../models/validations/product'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  public title: string = 'Création d\'un nouveau transfert';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public informationForm: FormGroup;
  public userData: any = {};
  private shops: Shop[];
  public filteredSenderShop: Observable<Shop[]>;
  public filteredReceiverShop: Observable<Shop[]>;  
  public productId: string = 'transfer-product'
  private table: ITable = {
    id: this.productId,
    header: tableProductHeader,
    body: null
  };
  public selectedProducts: Product[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private modalService: ModalService,
    private transferService: TransferService,
    private tableService: TableService,
    private itemSelectionService: ItemSelectionService,
    private tableFilterService: TableFilterService
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.getUserData();
    this.getAllShop();
    this.searchShopSender();
    this.searchShopReceiver();
    this.initProductTableSelected();
    this.getProductFilterValue();
    this.getSelectedProduct();
    this.getCancelSelectedProduct();
    this.getInputValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent(): void {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '/transfer',
        label: 'Liste des transferts',
      },
      {
        url: '',
        label: 'Nouveau transfert'
      }
    ]
  }

  createForm(): void {
    this.informationForm = this.formBuilder.group({
      userSender: ['', Validators.required],
      shopSender: ['', Validators.required],
      userReceiver: ['', Validators.required],
      shopReceiver: ['', Validators.required],
    });
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
    this.initializeForm();
  }

  initializeForm() {
    this.informationForm.patchValue({
      userSender: this.userData.user_uuid,
      userReceiver: this.userData.user_uuid,
    });
    this.informationForm.updateValueAndValidity();
  }

  getAllShop(): void {
    this.subscription.add(
      this.transferService.getShops().subscribe((response: ApiResponse) => {
        this.shops = response.data;
        this.filteredSenderShop = of(response.data);
        this.filteredReceiverShop = of(response.data);
        const shopSender = this.shops.filter((shop: Shop) => shop.shop_id == this.userData.shops[0].shop_id);
        this.informationForm.patchValue({shopSender: shopSender[0]});
        this.informationForm.updateValueAndValidity();
      })
    );
  }

  // matAutoComplete for sender site
  searchShopSender(): void {
    this.informationForm.controls['shopSender'].valueChanges.pipe(
      startWith<string | Shop | any>(''),
      map(value => typeof value === 'string' ? value : value.shop_name),
      map((value: string) => {
        return value != '' ? 
          (this.shops.filter((shop: Shop) => shop.shop_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) === 0))
          : this.shops
      })
    ).subscribe((shops: Shop[]) => {
      this.filteredSenderShop = of(shops);
    })
  }

  displayShopSender(shop: Shop): string {
    return shop.shop_name
  }

  // matAutoComplete for receiver site
  searchShopReceiver(): void {
    this.informationForm.controls['shopReceiver'].valueChanges.pipe(
      startWith<string | Shop | any>(''),
      map(value => typeof value === 'string' ? value : value.shop_name),
      map((value: string) => {
        return value != '' ? 
          (this.shops.filter((shop: Shop) => shop.shop_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) === 0))
          : this.shops
      })
    ).subscribe((shops: Shop[]) => {
      this.filteredReceiverShop = of(shops);
    });
  }

  displayShopReceiver(shop: Shop): string {
    return shop.shop_name;
  }

  initProductTableSelected(): void {
    this.tableService.setTableValue(this.table);
  }

  openModal(id: string): void {
    if (id === this.productId && this.informationForm.valid) {
      this.getProductInStock();
    }
    this.modalService.showModal(id);
  }

  closeModal(id: string) {
    this.modalService.hideModal(id);
  }

  getProductInStock(): void {
    this.subscription.add(
      this.transferService.getProductsInStock(this.informationForm.value['shopSender']['shop_uuid']).subscribe((response: ApiResponse) => this.getProductResponse(response))
    )
  }

  getProductResponse(response: ApiResponse) {
    const products = {id: this.productId, products: response.data};
    this.itemSelectionService.setProducts(products);
  }

  getProductFilterValue(): void {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == this.productId),
        switchMap((filter: ITableFilterSearchValue|null) => {
          const search = filter?.value['keyword']
          return this.transferService.getProductsInStock(this.informationForm.value['shopSender']['shop_uuid'], search);
        })
      ).subscribe((response: ApiResponse) => this.getProductResponse(response))
    );
  }

  validateSelectedProduct() {
    this.itemSelectionService.setValidateSelectedProduct(true);
  }

  private transferProduct: TransfertProduct[] = []
  private rows: IRow[] = [];
  getSelectedProduct() {
    this.subscription.add(
      this.itemSelectionService.getSelectedProducts().pipe(
        filter((value: any) => value && value['id'] == this.productId)
      ).subscribe((value: any) => {
        this.selectedProducts = value['products'];
        this.closeModal(this.productId);
        this.selectedProducts.forEach((product: Product) => {
          if (this.rows.length > 0 && this.rows.find((value: IRow) => value.id == product.product_uuid) ) {
            return;
          }
          this.transferProduct.push({
            productUuid: product.product_uuid,
            quantity: 1,
            isSerializable: product.is_serializable
          })
          let row: IRow = this.transferService.getTableRowValue(product);
          if (product.is_serializable) {
            row.rowValue[2].value[0].button = {
              size: 'btn-sm',
              bg: 'secondary',
              action: () => {
                this.openSerializationModal(product.product_uuid)
              }
            };
            row.rowValue[2].value[0].icon = {
              status: true,
              icon: 'exclamation-circle',
              color: 'danger'
            }
          } else {
            row.rowValue[2].value[0].icon = {
              status: true,
              icon: 'check-circle',
              color: 'success'
            }
          }
          this.rows.push(row)
        })
        let cells: ICell = {
          cellValue: this.rows,
          paginate: false,
        }
        this.table.body = cells;
        this.tableService.setTableValue(this.table);
      })
    );
  }

  getCancelSelectedProduct() {
    this.subscription.add(
      this.modalService.isCanceled$.subscribe((status: boolean) => {
        if(status) this.itemSelectionService.setCancelSelectedProduct(true);
      })
    )
  }

  getInputValue() {
    this.subscription.add(
      this.tableService.getInputValue().pipe(
        filter((value: InputValue) => value != null && value.tableId == this.productId)
        //TODO verify quantity in API & show notification if stock < value  
      ).subscribe((value: InputValue) => {
        this.transferProduct.map((transferProduct: TransfertProduct) => {
          if (transferProduct.productUuid == value.id) {
            transferProduct.quantity = +value.value;
          }
          return transferProduct;
        });
      })
    );
  }

  openSerializationModal(productUuid: string) {
    console.log("openSerializationModal::productUuid", productUuid);
  }
}
