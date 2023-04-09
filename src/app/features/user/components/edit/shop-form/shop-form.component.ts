import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Role } from 'src/app/shared/models/role/role.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-shop-form-edit',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.scss']
})
export class ShopFormComponent implements OnInit, OnDestroy {
  @Input() user!: User
  @Input() userRole!: Role
  public shopFormGroup!: FormGroup;
  private subscription = new Subscription;
  public shops: Shop[] = [];
  public isEditable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.initFormValue();
    this.getAllShop();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  createForm() {
    this.shopFormGroup = this.formBuilder.group({
      user: [
        '', 
        [
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ]
      ]
    });
  }

  initFormValue() {
    this.shopFormGroup.get('user')?.setValue(this.user.user_id);
  }

  get shopField(): FormArray {
    return this.shopFormGroup.get('shops') as FormArray;
  }

  addShop(id: number, name: string, isChecked: boolean, location: string) {
    const field = this.formBuilder.group({
      id: [id, Validators.required],
      isChecked: isChecked,
      name: [name, Validators.required],
      location: [location, Validators.required],
    });
    this.shopField.push(field);
  }

  public isAdmin: boolean = false;
  public selectedShopId: string = '';
  getAllShop() {
    this.subscription.add(
      this.userService.getAllShop().subscribe((response: ApiResponse) => {
        this.shops = response.data;
        console.log(this.user);
        
        if (
          this.userRole?.role_key == 'ADMIN' || 
          (this.userRole == undefined && this.user?.role?.role_key == 'ADMIN')
        ) {
          this.isAdmin = true;
          this.shopFormGroup?.removeControl('shops');
          this.shopFormGroup.addControl('shops', this.formBuilder.array([]));
          const userShopId = this.user.shops?.map((shop: Shop) => shop.shop_id);
          this.shops.forEach((shop: Shop) => {
            this.addShop(shop.shop_id, shop.shop_name, userShopId ? userShopId.includes(shop.shop_id) : false, shop.shop_location + ' ' + (shop.shop_box || ''));
          });
        } else {
          this.isAdmin = false;
          const shop = this.user.shops;
          this.shopFormGroup?.removeControl('shops');
          this.shopFormGroup.addControl('shops', this.formBuilder.control(shop ? shop[0]?.shop_id : '', Validators.required));
          this.selectedShopId = this.shopFormGroup.value['shops'];
        }
      })
    );
  }

  cancelEdit() {
    this.isEditable = false;
    this.getAllShop();
  }

  enableEdit() {
    this.isEditable = true;
  }

  editUserShop() {
    const value = this.shopFormGroup.value;
    let shops = [value['shops']];
    if ( value['shops'][0].id ) {
      shops = value['shops'].map((shop: any) => {
        if (shop['isChecked']) {
          return shop['id']
        }
      }).filter((id: number) => id != undefined);
    }
    console.log(shops);
    
    const shopInfo = {
      user: value['user'],
      shops: shops
    };
    this.saveEdit(shopInfo);
  }

  saveEdit(value: any) {
    this.subscription.add(
      this.userService.updateUserShop(value).subscribe((response: ApiResponse) => {
        this.showNotification('success', response.notification);
        this.isEditable = false;
      })
    );
  }


  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
