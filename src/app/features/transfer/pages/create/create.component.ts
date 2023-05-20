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
import { tableProductHeader } from '../../config/constant';
import { ItemSelectionService } from 'src/app/shared/services/item-selection/item-selection.service';
import { ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Product as TransfertProduct } from '../../models/validations/product'
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Router } from '@angular/router';
import { Serialization } from '../../models/validations/serialization';
import { Transfer } from '../../models/validations/transfer';
import { Table } from 'src/app/shared/models/table/table.model';
import { TableauService as TableService } from 'src/app/shared/services/table/tableau.service';
import { Line } from 'src/app/shared/models/table/body/line/line.model';

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
  public selectedProducts: Product[] = [];
  public transferProduct: TransfertProduct[] = [];
  public productTable: Table = {
    id: 'product-table',
    header: tableProductHeader,
    body: {
      bodyId: 'product-table-body',
      line: []
    },
    action: {
      delete: true,
      edit: false
    }
  };
  private line: Line[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private modalService: ModalService,
    private transferService: TransferService,
    private itemSelectionService: ItemSelectionService,
    private tableFilterService: TableFilterService,
    private notificationService: NotificationService,
    private router: Router,
    private tableService: TableService
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
    this.getProductSerialization();
    this.getTableLineId();
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

  clear() {
    this.line = [];
    this.transferProduct = [];
    this.selectedProducts = [];
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
    this.tableService.setTable(this.productTable)
  }

  openModal(id: string): void {
    if (id === this.productId && this.informationForm.valid) {
      this.getProductInStock();
      this.itemSelectionService.setSelectedProducts({
        id: this.productId,
        products: this.selectedProducts
      })
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

  getProductResponse(response: ApiResponse): void {
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

  public serializationIsValid: boolean = false;
  getSelectedProduct(): void {
    this.subscription.add(
      this.itemSelectionService.getSelectedProducts().pipe(
        filter((value: any) => value && value['id'] == this.productId)
      ).subscribe((value: any) => {
        this.selectedProducts = value['products'];
        this.closeModal(this.productId);
        this.selectedProducts.forEach((product: Product) => {

          this.transferService.getTableProduct(product)
          if (this.line.length > 0 && this.line.find((value: Line) => value.lineId == product.product_uuid) ) {
            return;
          }
          this.transferProduct.push({
            product_uuid: product.product_uuid,
            label: product.label,
            quantity: 1,
            is_serializable: product.is_serializable,
            serializations: []
          })
          let line: Line = this.transferService.getTableProduct(product);
          const isButton = line.column[2].content[0].type;
          if (product.is_serializable && isButton == 'button') {
            line.column[2].content[0].function =  () => {this.openSerializationModal(product.product_uuid)}
          }
          this.line.push(line);
        });
        this.productTable.body.line = this.line;
        this.tableService.setTable(this.productTable);
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

  getInputValue(): void {
    this.subscription.add(
      this.tableService.getTableInputValue().pipe(
        filter((value: any) => value['tableId'] == 'product-table' && value['value'] != null && value['value'] != ''),
        switchMap((value: any) => {
          const product = value['line'];
          const shop = this.informationForm.value['shopSender'].shop_uuid;
          return this.transferService.verifyStock(shop, product, value['value']);
        })
      ).subscribe((response: ApiResponse) => {
        if (!response.data.quantityIsValid) {
          this.showNotification('danger', `Quantité saisie indisponible. Quantité en stock restant : ${response.data.quantityRemaining}`);
        } else {
          this.transferProduct.map((transferProduct: TransfertProduct) => {
            if (transferProduct.product_uuid == response.data.product) {
              transferProduct.quantity = response.data.quantityInput;
              transferProduct.serializations = [];
              let column = this.line.filter((line: Line) => line.lineId == response.data.product)[0]
              let content = column.column[2].content[1];
              if (content.type == 'icon') { 
                content.icon = 'fas fa-exclamation-circle';
                content.bg =  'text-danger';
              };
            }
            return transferProduct;
          });
        }
      })
    );
  }

  showNotification(type: string, message: string): void {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }

  openSerializationModal(productUuid: string): void {
    const transferProduct = this.transferProduct.filter((product: TransfertProduct) => product.product_uuid == productUuid)[0]
    this.transferService.setSelectedProduct(transferProduct);
    this.openModal('serialization');
  }

  saveSerialization(): void {
    this.transferService.setSaveSerialization(true);
  }

  getProductSerialization(): void {
    this.subscription.add(
      this.transferService.getProductSerialization().subscribe((productSerialization: TransfertProduct) => {
        this.transferProduct.map((product: TransfertProduct) => {
          if (product.product_uuid == productSerialization.product_uuid) {
            let isValid = true;
            product['serializations'] = productSerialization.serializations;
            product['serializations']?.forEach((serialization: Serialization) => {
              if (!serialization.is_valid && serialization.label == '' && serialization.group_id == '') isValid = false;
            })
            let column = this.line.filter((line: Line) => line.lineId == productSerialization.product_uuid)[0]
            let content = column.column[2].content[1];
            if (content.type == 'icon') { 
              content.icon = isValid ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
              content.bg = isValid ? 'text-success' : 'text-danger';
            };
          }
          return product;
        });
        this.closeModal('serialization');
      })
    );
  }

  getTableLineId() {
    this.subscription.add(
      this.tableService.getAction().pipe(
        filter((value: any) => value && value != null)
      ).subscribe((value: any) => {
        if (value['name'] == 'delete') {
          this.selectedProducts = this.selectedProducts.filter((product: Product) => product.product_uuid != value['id']);
          this.transferProduct = this.transferProduct.filter((product: TransfertProduct) => product.product_uuid != value['id']);
          this.line = this.line.filter((line: Line) => line.lineId != value['id']);
        };
      })
    );
  }

  cancelCreate() {
    this.router.navigateByUrl('/transfer')
  }

  create() {
    let isValid = true;
    this.transferProduct.forEach((transferProduct: TransfertProduct) => {
      if (transferProduct.is_serializable) {
        if (transferProduct.serializations && transferProduct.serializations.length > 0) {
          transferProduct.serializations.forEach((serialization: Serialization) => {
            if (serialization.group_id == '' || serialization.label == '' || serialization.value == '') {
              isValid = false;
              return;
            }
          })
        } else {
          isValid = false;
          return;
        }
      }
    })

    if (!isValid || !this.informationForm.valid) {
      this.showNotification('danger', 'Veuillez verifier les informations saisies')
    } else {
      const value = {
        user: this.informationForm.value['userSender'],
        shop_sender: this.informationForm.value['shopSender'].shop_uuid,
        shop_receiver: this.informationForm.value['shopReceiver'].shop_uuid,
        commentary: '',
        products: this.transferProduct
      };
      this.saveTransfer(value)
    }
  }

  saveTransfer(value: Transfer) {
    this.subscription.add(
    this.transferService.create(value).subscribe((response: ApiResponse) => {
      this.showNotification('success', 'Transfert enregistré avec succès.');
      setTimeout(() => this.router.navigateByUrl('/transfer'), 1000);
    })
    )
  }

  updateSerialNumberIcon() {
    
  }

  getTableInputValue() {
    this.subscription.add(
      this.tableService.getTableInputValue().subscribe((value: any) => {    
        if (value['tableId'] == 'product-table') {
          const line = this.productTable.body.line.filter((line: Line) => line.lineId == value['line'])[0];
          const indexes = value['indexes'].split('-');

          console.log(value);
          
          // Ajout icon check line 1 and column 2
          /*let column = line.column[2];
          column.content[1] = 
            {
              type: 'icon',
              key: "string",
              icon: 'fas fa-check-circle',
              bg: 'text-success',
              tooltip: {
                hasTooltip: true,
                text: 'Valide',
                flow: 'top'
              }
            };
          
          const _value = {
            tableId: value['tableId'],
            line: value['line'],
            index: 1,
            columns: column
          }
          this.tableService.setColumn(_value);*/
        }
      })
    );
  }
}
