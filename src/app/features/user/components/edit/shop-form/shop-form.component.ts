import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
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
  public shopFormGroup!: FormGroup;
  private subscription = new Subscription;
  public shops: Shop[] = [];
  public isEditable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
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
      this.userService.getAllShop().subscribe((response: ApiResponse) =>{
        this.shops = response.data;
        if (this.user?.role?.role_key == 'ADMIN') {
          this.isAdmin = true;
          this.shopFormGroup?.removeControl('shops');
          this.shopFormGroup.addControl('shops', this.formBuilder.array([]));
          const userShopId = this.user.shops?.map((shop: Shop) => shop.shop_id);
          this.shops.forEach((shop: Shop) => {
            console.log(shop);
            
            this.addShop(shop.shop_id, shop.shop_name, userShopId ? userShopId.includes(shop.shop_id) : false, shop.shop_location + ' ' + (shop.shop_box || ''));
          });

        console.log('this.user', this.shopFormGroup.value);
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
  }

  enableEdit() {
    this.isEditable = true;
  }
}
