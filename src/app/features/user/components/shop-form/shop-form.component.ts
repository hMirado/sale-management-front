import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.scss']
})
export class ShopFormComponent implements OnInit, OnDestroy {
  public shopFormGroup!: FormGroup;
  private subscription = new Subscription;
  public userCreated: User;
  public shops: Shop[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.getAllShop();
    this.getUserCreated();
    this.formGroupValueChange();
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
      ],
      trigger: false
    });
  }

  get shopField(): FormArray {
    return this.shopFormGroup.get('shops') as FormArray;
  }

  addShop(id: number, name: string, location: string) {
    const field = this.formBuilder.group({
      id: [id, Validators.required],
      isChecked: false,
      name: [name, Validators.required],
      location: [location, Validators.required],
    });
    this.shopField.push(field);
  }

  getAllShop() {
    this.subscription.add(
      this.userService.getAllShop().subscribe((response: ApiResponse) =>{
        this.shops = response.data;
      })
    );
  }

  getUserCreated() {
    this.subscription.add(
      this.userService.getUserCreated().subscribe((user: User) => {
        if (user) {
          this.userCreated = user;
          this.shopFormGroup.controls['user'].setValue(user.user_id);
          if (user?.role?.role_key == 'ADMIN') {
            this.shopFormGroup?.removeControl('shops');
            this.shopFormGroup.addControl('shops', this.formBuilder.array([]))
            this.shops.forEach((shop: Shop) => {
              this.addShop(shop.shop_id, shop.shop_name, shop.shop_location + ' ' + (shop.shop_box || ''));
            });
            this.shopsFieldValueChange();
          } else {
            this.shopFormGroup?.removeControl('shops');
            this.shopFormGroup.addControl('shops', this.formBuilder.control('', Validators.required));
          }
        }
      })
    );
  }

  triggerEvent(isTriggered: boolean = true) {
    this.shopFormGroup.controls['trigger'].setValue(isTriggered);
    this.shopFormGroup.updateValueAndValidity();
  }

  shopsFieldValueChange() {
    this.subscription.add(
      this.shopField.valueChanges.pipe(
        filter(value => value && this.shopFormGroup.value['trigger'] && this.userCreated?.role?.role_key == 'ADMIN'),
        debounceTime(250)
      ).subscribe((values: any) => {
        this.shopFormGroup.controls['trigger'].setValue(false);
        let ids: number[] = [];
        values.forEach((value: any) => {
           if (value['isChecked']) ids.push(value['id']);
        })
        const shopInfo = {
          user: this.userCreated.user_id,
          shops: ids
        }
        this.userService.nextUserShop(shopInfo);
      })
    );
  }

  formGroupValueChange() {
    this.subscription.add(
      this.shopFormGroup.valueChanges.pipe(
        filter(value => value && this.shopFormGroup.value['trigger'] && this.userCreated?.role?.role_key != 'ADMIN'),
        debounceTime(250)
      ).subscribe((values: any) => {
        let shops = [values['shops']];
        if ( values['shops'][0].id ) {
          shops = values['shops'].map((shop: any) => {
            if (shop['isChecked']) {
              return shop['id']
            }
          }).filter((id: number) => id != undefined);
        }
        const shopInfo = {
          user: values['user'],
          shops: shops
        };
        this.userService.nextUserShop(shopInfo);
      })
    );
  }
}
