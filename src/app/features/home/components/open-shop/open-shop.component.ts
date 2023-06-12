import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, filter, map, of, startWith } from 'rxjs';
import { userInfo } from 'src/app/shared/config/constant';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-open-shop',
  templateUrl: './open-shop.component.html',
  styleUrls: ['./open-shop.component.scss']
})
export class OpenShopComponent implements OnInit, OnDestroy {
  @Output() formValue = new EventEmitter<Shop|null>();
  public shops: Shop[] = [];
  public filteredShops: Observable<Shop[]>;
  public formGroup!: FormGroup;
  public formError: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    ) {
      this.createForm()
    }

  ngOnInit(): void {
    this.getUserShop();
    this.searchShop();
  }

  ngOnDestroy(): void {
  }

  getUserShop() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    const userData = JSON.parse(this.helperService.decrypt(data));
    this.shops = userData.shops;
    this.filteredShops = of(userData.shops);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      shop: [{}, Validators.required],
      trigger: false
    })
  }

  triggerEvent() {
    this.formGroup.get('trigger')?.setValue(true);
    this.formGroup.updateValueAndValidity()
  }

  searchShop() {
    this.formGroup.controls['shop'].valueChanges.pipe(
      startWith<string | Shop | any>(''),
      filter(value => this.formGroup.controls['trigger'].value),
      map(value => typeof value === 'string' ? value : value.shop_name),
      map((value: string) => {
        this.formGroup.get('trigger')?.setValue(false);
        return value != '' ? 
          (this.shops.filter((shop: Shop) => shop.shop_name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) === 0))
          : this.shops
      })
    ).subscribe((shops: Shop[]) => {
      this.filteredShops = of(shops);
      this.formError = true;
      this.emitValue(null);
    })
  }

  displayShop(shop: Shop): string {
    return shop.shop_name || '';
  }

  select() {
    this.formError = false;
    const value = this.formGroup.controls['shop'].value;
    this.emitValue(value)
  };

  emitValue(shop : Shop|null) {
    this.formValue.emit(shop);
  }
}
