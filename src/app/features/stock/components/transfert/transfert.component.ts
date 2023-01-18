import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { tokenKey } from 'src/app/shared/config/constant';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { SerializationType } from '../../models/serialization-type/serialization-type.model';
import { TransferService } from '../../services/transfer/transfer.service';

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public uniqueId: string = 'transfer-id';
  public transferFormGroup!: FormGroup;
  private userData: any = {}
  public products: Product[] = [];
  public searchProducts: Product[] = [];
  public serializationTypes: SerializationType[] = [];
  public shops: Shop[] = [];
  private isSerializable: boolean = false;
  public formError: boolean = false;

  constructor(
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private transferService: TransferService,
  ) { 
    this.getUserData();
    this.createForm();
  }

  ngOnInit(): void {
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
    this.getProducts();
    this.getSerializationTypes();
    this.getShops();
  }

  closeModal(id: string) {
    this.modalService.hideModal(id);
    this.clearForm();
  }

  createForm() {
    this.transferFormGroup = this.formBuilder.group({
      userSender: [this.userData?.user_uuid, Validators.required],
      userReceveir: [this.userData?.user_uuid, Validators.required],
      shopSender: [this.userData?.shop?.shop_uuid, Validators.required],
      shopReceveir: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      serialization: this.formBuilder.array([])
    })
  }

  clearForm() {
    this.transferFormGroup.reset();
    this.serializationField.clear();
    this.serializationField.reset();
  }

  resetField() {
    this.serializationField.clear();
    this.serializationField.reset();
  }

  get serializationField(): FormArray {
    return this.transferFormGroup.get('serialization') as FormArray;
  }

  removeSerializationField(i: number) {
    this.serializationField.removeAt(i);
  }

  addSerializationField() {``

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
    const quantity = this.transferFormGroup?.get('quantity');
    if (this.isSerializable && quantity?.value > 0) {
      for (let i = 0; i < +quantity?.value; i ++) {
        this.addSerializationField();
      }
    }
  }

  getQuantityValueChange() {
    this.resetField();
    const quantity = this.transferFormGroup?.get('quantity');
    if (quantity?.value > 0 && this.isSerializable) {
      //TODO: check item stock  
      for (let i = 0; i < +quantity?.value; i++) {
        this.addSerializationField();
      }
    }
  }

  //TODO: check remove serial number in serialization input
}
