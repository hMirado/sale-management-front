import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { ADMIN, inputTimer, userInfo } from 'src/app/shared/config/constant';
import { ITableFilter, ITableFilterFieldValue, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { TabService } from 'src/app/shared/services/tab/tab.service';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { TableService } from 'src/app/shared/services/table/table.service';
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
  public shopsSender: Shop[] = [];
  public shopsReceiver: Shop[] = [];
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
  public inProgress = transferStatus.inProgress;

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
    this.cancel();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private currentShop: string = '';
  private currentUser: string = '';
  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data))

    this.currentShop = ''
    if (this.userData.role.role_key != ADMIN) {
      this.currentShop = this.userData.shops[0].shop_uuid;
      this.currentUser = this.userData.user_uuid
    }
  }

  openModal(id: string) {
    this.modalService.showModal(id);
    if (id == this.transferId) {
      this.getProducts();
      this.getSerializationTypes();
      this.getShopSender();
      this.getShopsReceiver();
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
      shopSender: ['', Validators.required],
      shopReceiver: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      commentary: [''],
      serialization: this.formBuilder.array([]),
      trigger: [false]
    })
  }

  trigger(status: boolean = true) {
    this.transferFormGroup.patchValue({trigger: status});
    this.transferFormGroup.updateValueAndValidity();
  }

  clearForm() {
    this.transferFormGroup.reset({
      userSender: this.userData?.user_uuid,
      userReceiver: this.userData?.user_uuid,
      shopSender: '',
      shopReceiver: '',
      product: '',
      quantity: '',
      commentary: '',
      serialization: this.formBuilder.array([]),
      trigger: false
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

  getShopSender() {
    if (this.userData.role.role_key == 'ADMIN') {
      this.subscription.add(
        this.transferService.getShops().subscribe((response: ApiResponse) => {
          if (response.status == responseStatus.success) {
            this.shopsSender = response.data;
          }
        })
      );
    } else {
      this.shopsSender = this.userData.shops
    }
  }

  getShopsReceiver() {
    this.subscription.add(
      this.transferService.getShops().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.shopsReceiver = response.data;
        }
      })
    );
  }

  getProductValueChange() {
    const item = this.transferFormGroup?.get('product');
    if (item) {
      this.subscription.add(
        item.valueChanges.pipe(
          filter(value => {
            return this.transferFormGroup.value['trigger']
          }),
          distinctUntilChanged((prev, curr)=>{
            return prev.label === curr.label;
          }),
          debounceTime(inputTimer),
          filter(value => (value.length >= 3 || value == '') ),
          switchMap((product: string) => {
            this.trigger(false);
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
        filter(value => {
          return this.transferFormGroup.value['trigger']
        }),
        debounceTime(inputTimer),
        switchMap((isValid: boolean) => {
          this.trigger(false);
          if (isValid) {
            const shopSender = this.transferFormGroup?.get('shopSender')?.value;
            return this.transferService.getProductQuantity(shopSender, this.searchProducts[0].product_uuid)
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
      debounceTime(inputTimer + 200),
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

  cancel() {
    this.subscription.add(
      this.modalService.isCanceled$.subscribe((isCanceled: boolean) => {
        if (isCanceled) this.clearForm();
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
      this.transferService.getTransfers(this.currentShop, this.currentUser).subscribe((response: ApiResponse) => this.getTransfersResponse(response))
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
        const shopsIds = this.userData.shops.map((shop: Shop) => shop.shop_id);
        const row: IRow = this.transferService.getTableRowValue(transfer, shopsIds);
        this.rows.push(row);
      })
      const cell: ICell = {
        cellValue: this.rows,
        paginate: true,
        isEditable: true
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
          this.rows = [];
          this.params['page'] = 1;
          this.params = { ...this.params, ... filter?.value }
          return this.transferService.getTransfers(this.currentShop, this.currentUser, this.params)
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

  goToNextPage(page: number){
    this.params['page'] = page;
    this.transferService.getTransfers(this.currentShop, this.currentUser, this.params).subscribe((response: ApiResponse) => this.getTransfersResponse(response));
  }
}

//TODO Add commentary for transfer and return
//TODO Update transfer function (multiple product)