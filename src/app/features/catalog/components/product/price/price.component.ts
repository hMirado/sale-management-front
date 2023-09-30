import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductFormValue } from '../../../models/validations/product-form-value';
import { Product } from '../../../models/product/product.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, filter } from 'rxjs';
import { ProductService } from '../../../service/product/product.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ShopService } from 'src/app/features/setting/services/shop/shop.service';
import { Price } from '../../../models/price/price.model';
import { Shop } from 'src/app/features/setting/models/shop/shop.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { inputTimer } from 'src/app/shared/config/constant';

@Component({
  selector: 'app-product-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit, OnDestroy {
  @Input() information!: Product;
  @Output() priceEvent = new EventEmitter<any>();
  public priceFormgroup: FormGroup;
  private subscription = new Subscription;
  public isAllShop: boolean = false;
  public formError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private shopService: ShopService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getShops();
    this.priceFormgroup.controls['allShop'].valueChanges.pipe(
      filter(value => this.priceFormgroup.controls['trigger'].value)
    ).subscribe(value => {
      this.isAllShop = value;
      this.priceFormgroup.patchValue({trigger: false});
    });
    this.getPricesValues();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.priceFormgroup = this.formBuilder.group({
      product: this.information.product_uuid,
      prices: this.formBuilder.array([]),
      trigger: false,
      allShop: false
    })
  }

  get priceField(): FormArray {
    return this.priceFormgroup.get('prices') as FormArray
  }

  addPriceField(htPrice: number, ttcPrice: number, shopId: number, shopName: string) {
    const field = this.formBuilder.group({
      htPrice: [htPrice / 100, Validators.required],
      ttcPrice: [ttcPrice / 100, Validators.required],
      shopId: [shopId, Validators.required],
      shopName: [shopName, Validators.required],
    });
    this.priceField.push(field);
  }

  getShops() {
    this.subscription.add(
      this.shopService.getShops().subscribe((response: ApiResponse) => {
        if (this.information.prices?.length as number > 0 ) {
          const merged = this.information.prices?.map((price: Price) => {
            const matchingItem = response.data.find((i: Shop) => i.shop_id === price.fk_shop_id);
            return { ...price, ...matchingItem };
          })
          
          merged?.forEach((item: any) => {
            this.addPriceField(item['ht_price'], item['ttc_price'], item['shop_id'], item['shop_name']);
          })
        } else if (response.data.length > 0) {
          response.data.forEach((shop: Shop) => {
            this.addPriceField(0, 0, shop['shop_id'], shop['shop_name']);
          })
        }
      })
    )
  }

  triggerEvent() {
    this.priceFormgroup.patchValue({trigger: true});
    this.priceFormgroup.updateValueAndValidity();
  }

  getPricesValues() {
    this.subscription.add(
      this.priceField.valueChanges.pipe(
        debounceTime(inputTimer),
        filter(value => this.isAllShop)
      ).subscribe(values => {
        const value = values[0].ttcPrice;
        const newPrices = values.map((v: any) => {
          return {
            htPrice: value * 0.8,
            ttcPrice: value,
            shopId: v.shopId,
            shopName: v.shopName 
          }
        })
        this.priceField.patchValue(newPrices);
      })
    )
  }

  public isEditable: boolean = false;
  enableEdit() {
    this.isEditable = true
  }

  cancelEdit() {
    this.priceField.reset();
    this.priceField.clear();
    this.getShops();
    this.isEditable = false;
  }

  savePrice() {
    if (!this.priceFormgroup.valid) {
      this.formError = true
    } else {
      this.formError = true
      const value = {
        product: this.priceFormgroup.value['product'],
        prices: this.priceFormgroup.value['prices']
      }
      this.priceEvent.emit(value);
      this.isEditable = false;
    }
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
