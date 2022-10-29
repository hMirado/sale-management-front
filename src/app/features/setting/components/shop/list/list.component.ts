import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Shop } from '../../../models/shop/shop.model';
import { ShopService } from '../../../services/shop/shop.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  public shops: Shop[] = [];
  public shopFormGroup!: FormGroup;
  private shopUuid: string = '';
  public isEdit: boolean = false;
  constructor(
    private shopService: ShopService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getNextedShopsValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() : void {
    this.shopFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      box: [''],
      city: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.shopFormGroup.reset();
    this.shopUuid = '';
  }

  getNextedShopsValue() {
    this.subscription.add(
      this.shopService.shops$.subscribe((_shops: Shop[]) => {
        if(_shops.length > 0) this.shops = _shops;
      })
    );
  }

  /**
   * 
   * @param status : boolean
   * @returns status-text: string
   */
  getShopStatusText(status: boolean): string {
    return status? 'Activé' :'Désactivé';
  }

  /**
   * @param uuid : string
   * @param status : boolean
   */
  updateShopStatus(uuid: string, status: boolean) {
    let shopStatus: Object = {
      status: !status
    }
    this.subscription.add(
      this.shopService.updateShopStatus(uuid, shopStatus).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.showNotification('success', response.notification)
          this.shopService.nextUpdateStatus(true);
        }
      })
    );
  }

  /**
   * @description choose a shop to edit
   * @param uuid : string
   */
  editShop(uuid: string) {
    this.shopUuid = uuid;
    this.isEdit = true;
    let shop: Shop = this.shops.filter(_shop => _shop.shop_uuid === uuid)[0];
    
    this.shopFormGroup.patchValue(
      {
        name: shop.shop_name,
        location: shop.shop_location,
        box: shop.shop_box,
        city: shop.city
      }
    )
  }

  /**
   * @description update a shop
   */
  updateShop() {
    let shop: Shop = new Shop();
    shop.shop_name = this.shopFormGroup.controls['name'].value;
    shop.shop_location = this.shopFormGroup.controls['location'].value;
    shop.shop_box = this.shopFormGroup.controls['box'].value;
    shop.city = this.shopFormGroup.controls['city'].value;

    this.subscription.add(
      this.shopService.updateShop(this.shopUuid, shop).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.showNotification('success', response.notification)
          this.shopService.nextUpdateStatus(true);
          this.resetForm();
        }
      })
    );
  }

  /**
   * @description create a new shop
   */
  createShop() {
    let shop: Shop = new Shop();
    shop.shop_name = this.shopFormGroup.controls['name'].value;
    shop.shop_location = this.shopFormGroup.controls['location'].value;
    shop.shop_box = this.shopFormGroup.controls['box'].value;
    shop.city = this.shopFormGroup.controls['city'].value;
    shop.status = true;
    shop.companyCompanyId = 1;

    this.subscription.add(
      this.shopService.createShop(shop).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.showNotification('success', response.notification)
          this.shopService.nextUpdateStatus(true);
          this.resetForm();
        }
      })
    );
  }

  /**
   * @description submit shopFormGroup, update or create
   */
  onSubmit() {
    if (this.shopUuid != '') this.updateShop();
    else this.createShop();
  }

  /**
   * @description cancel update
   */
  cancel() {
    this.shopUuid = '';
    this.isEdit = false;
    this.resetForm();
  }

  /**
   * @description Notification
   * @param type 
   * @param message 
   */
  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
