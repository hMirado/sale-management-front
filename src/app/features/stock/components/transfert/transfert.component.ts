import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { tokenKey } from 'src/app/shared/config/constant';
import { ITableFilter, ITableFilterFieldValue, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TabService } from 'src/app/shared/serives/tab/tab.service';
import { TableFilterService } from 'src/app/shared/serives/table-filter/table-filter.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { tableTransferHeader, tableTransferId, transferStatus } from '../../config/constant';
import { SerializationType } from '../../models/serialization-type/serialization-type.model';
import { Serialization } from '../../models/serialization/serialization.model';
import { Transfer } from '../../models/transfer/transfer.model';
import { TransferService } from '../../services/transfer/transfer.service';

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public transferId: string = 'transfer-id';
  public transferFormGroup!: FormGroup;
  private userData: any = {}
  public products: Product[] = [];
  public searchProducts: Product[] = [];
  public serializationTypes: SerializationType[] = [];
  public shops: Shop[] = [];
  private isSerializable: boolean = false;
  public formError: boolean = false;
  private quantityIsValid: Observable<boolean> = of(false);
  public quantityError: boolean = false;
  private transfers: Transfer[] = [];
  public transfer: Transfer;
  private rows: IRow[] = [];
  public tableId: string = tableTransferId;
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public serializations: Serialization[] = [];
  public inProgress = transferStatus.inProgress

  constructor(
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private transferService: TransferService,
    private tabService: TabService,
    private tableService: TableService,
    private notificationService: NotificationService,
    private tableFilterService: TableFilterService
  ) { 
    this.getUserData();
    this.createForm();
  }

  ngOnInit(): void {
    this.getTab();
    this.openModalConfirmTransfer();
    this.getFilterValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserData() {
    const token = this.localStorageService.getLocalStorage(tokenKey);
    const decodedToken = this.helperService.decodeJwtToken(token);
    this.userData = decodedToken.user;
  }

  openModal(id: string) {
    this.modalService.showModal(id);
    if (id == this.transferId) {
      this.getProducts();
      this.getSerializationTypes();
      this.getShops();
    }
  }

  closeModal(id: string) {
    this.modalService.hideModal(id);
    this.clearForm();
  }

  createForm() {
    this.transferFormGroup = this.formBuilder.group({
      userSender: [this.userData?.user_uuid, Validators.required],
      userReceiver: [this.userData?.user_uuid, Validators.required],
      shopSender: [this.userData?.shop?.shop_uuid, Validators.required],
      shopReceiver: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      serialization: this.formBuilder.array([])
    })
  }

  clearForm() {
    this.transferFormGroup.reset();
    this.transferFormGroup.patchValue({
      userSender: this.userData?.user_uuid,
      userReceiver: this.userData?.user_uuid,
      shopSender: this.userData?.shop?.shop_uuid
    });
    this.transferFormGroup.updateValueAndValidity();
    this.serializationField.clear();
    this.serializationField.reset();
  }

  resetField() {
    this.quantityIsValid = of(false);
    this.serializationField.clear();
    this.serializationField.reset();
  }

  get serializationField(): FormArray {
    return this.transferFormGroup.get('serialization') as FormArray;
  }

  removeSerializationField(i: number) {
    this.serializationField.removeAt(i);
  }

  addSerializationField() {
    this.serializationField.push(
      this.formBuilder.group({
        type: ['', Validators.required],
        value: ['', Validators.required]
      })
    )
  }

  getProducts(){
    this.subscription.add(
      this.transferService.getProducts().subscribe((response: ApiResponse) => {
        switch (response.status) {
          case responseStatus.success:
            this.products = response.data;
            this.searchProducts = response.data;
            break;
        }
      })
    );
  }

  getSerializationTypes() {
    this.subscription.add(
      this.transferService.getSerializationTypes().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.serializationTypes = response.data;
        }
      })
    );
  }

  getShops() {
    this.subscription.add(
      this.transferService.getShops().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.shops = response.data.filter((shop: Shop) => shop.shop_id != this.userData.shop.shop_id);
        }
      })
    );
  }

  getProductValueChange() {
    const item = this.transferFormGroup?.get('product');
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
              const result = this.products.filter(x =>  x.label.toLowerCase().includes(product.toLowerCase()));
              return of(result);
            }
          })
        ).subscribe((response: Product[]) => {
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
    const quantity = this.transferFormGroup?.get('quantity')?.value;
    if (this.isSerializable && quantity > 0) {
      this.quantityIsValid = of(true);
      this.getQuantityIsValid(quantity);
    }
  }

  getQuantityValueChange() {
    this.resetField();
    const quantity = this.transferFormGroup?.get('quantity')?.value;
    if (quantity > 0 && this.isSerializable) {
      this.quantityIsValid = of(true);
      this.getQuantityIsValid(quantity);
    }
  }

  getQuantityIsValid(quantity: number) {
    this.subscription.add(
      this.quantityIsValid.pipe(
        debounceTime(500),
        switchMap((isValid: boolean) => {
          if (isValid) {
            return this.transferService.getProductQuantity(this.userData.shop.shop_uuid, this.searchProducts[0].product_uuid)
          } else { 
            return []
          }
        })
      ).subscribe((response: ApiResponse) => {
        this.quantityIsValid = of(false);
        if (response.status == responseStatus.success) {
          if (response.data.length == 0 || response?.data[0].quantity < quantity) {
            this.quantityError = true;
          } else {
            this.quantityError = false;
            for (let i = 0; i < +quantity; i++) {
              this.addSerializationField();
            }
          }
        }
      })
    );
  }

  public serializationInvalid: boolean = false;
  checkSerializationValue(i: number) {
    this.serializationField.at(i).valueChanges.pipe(
      debounceTime(700),
      filter(value => value?.value?.length > 2),
      switchMap(value => {
        if (value != '') {
          return this.transferService.verifySerialNumber(this.searchProducts[0].product_uuid, value['type'], value['value']);
        } else {
          this.serializationInvalid = true;
          return []
        }
      })
    ).subscribe((response: ApiResponse) => {
      this.serializationInvalid = response.data != null ? false : true;
      if (this.serializationInvalid)this.serializationField.at(i).get('value')?.setErrors({'status': 'INVALID'})
    })
  }

  createTransfer() {
    if (this.transferFormGroup.valid) {
      const value = this.transferFormGroup.value;
      value.product = this.searchProducts[0].product_uuid;
      this.saveTransfer(value);
    }
  }

  saveTransfer(value: any) {
    this.subscription.add(
      this.transferService.createTransfer(value).subscribe((response: ApiResponse) => {
        this.clearForm();
        this.resetField();
        this.closeModal(this.transferId);
        this.getTransfers();
        this.showNotification(
          'success',
          response.notification
        );
      })
    )
  }

  getTab() {
    this.subscription.add(
      this.tabService.getTab().subscribe(tabId => {
        if (tabId == this.transferId) {
          this.getTransfers();
          this.getShopFilter();
        }
      })
    );
  }

  getTransfers() {
    this.subscription.add(
      this.transferService.getTransfers().subscribe((response: ApiResponse) => this.getTransfersResponse(response))
    )
  }

  getTransfersResponse(response: ApiResponse) {
    let table: ITable = {
      id: this.tableId,
      header: tableTransferHeader,
      body: null
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      this.transfers = response.data.items;
      this.transfers.forEach((transfer: Transfer) => {
        const row: IRow = this.transferService.getTableRowValue(transfer, this.userData.shop.shop_id);
        this.rows.push(row);
      })
      const cell: ICell = {
        cellValue: this.rows,
        isViewable: true
      }
      table.body = cell;
      this.tableService.setTableValue(table);
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
  }
  getShopFilter() {
    this.subscription.add(
      this.transferService.getShops().subscribe((response: ApiResponse) => {
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
        this.transferFilter(shopFilter);
      })
    );
  }

  transferFilter(shop: ITableFilterFieldValue[]) {
    let transferFilter: ITableFilter = { id: 'transfer-filter', title: '', fields: [] }
    const transferStatus: ITableFilterFieldValue[] = [
      {
        key: 'all',
        label: 'Tous',
        value: 'all',
        default: true
      },
      {
        key: 'IN_PROGRESS',
        label: 'En cours',
        value: 'IN_PROGRESS'
      },
      {
        key: 'VALIDATED',
        label: 'Validé',
        value: 'VALIDATED'
      },
      {
        key: 'CANCELLED',
        label: 'Annulé',
        value: 'CANCELLED'
      },
    ];
    transferFilter.fields = this.transferService.filter(shop, transferStatus);
    this.tableFilterService.setFilterData(transferFilter)
  }

  private params: any = {}
  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'transfer-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.rows = []
          this.params['p'] = 0
          filter?.value.forEach((value, i) => {
            this.params[Object.keys(value)[0]] = value[Object.keys(value)[0]]
          })
          return this.transferService.getTransfers('', '', this.params)
        })
      ).subscribe((response: ApiResponse) => this.getTransfersResponse(response))
    );
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }

  openModalConfirmTransfer() {
    this.subscription.add(
      this.tableService.getDetailId().pipe(
        filter((uuid: string) => uuid != ''),
        switchMap((uuid: string) => {
          const transfer = this.transfers.filter(_transfer => _transfer.transfer_uuid == uuid)[0];
          const inProgress = transfer.transfer_status.transfer_status_code.toUpperCase() == transferStatus.inProgress ? true : false
          return this.transferService.getTransfer(uuid, transfer.shop_receiver.shop_uuid, inProgress);
        })
      ).subscribe((response: ApiResponse) => this.getTransferResponse(response))
    );
  }

  getTransferResponse(response: ApiResponse) {
    if (response.status == responseStatus.success) {
      this.transfer = response.data;
      console.log(this.transfer);
      if (this.transfer?.product.is_serializable) {
        this.serializations = response.data.product.serializations;
      }
      this.openModal('comfirm-id');
    }
  }

  confirm(isValidate: boolean) {
    const uuid = this.transfer.transfer_uuid;
    const user = this.userData.user_uuid
    
    this.subscription.add(
      this.transferService.confirm(uuid, user, isValidate).subscribe((response: ApiResponse) => this.confirmResponse(response))
    )
  }

  confirmResponse(response: ApiResponse) {
    this.getTransfers();
    this.closeModal('comfirm-id');
  }
}

//TODO Add commentary for transfer and return
//TODO Update transfer function (multiple product)