import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { userInfo, ADMIN } from 'src/app/shared/config/constant';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TransferService } from '../../services/transfer/transfer.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { ITable } from 'src/app/shared/models/table/i-table';
import { tableProductHeader } from '../../config/constant';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';

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
  private table: ITable = {
    id: this.productId,
    header: tableProductHeader,
    body: null
  }

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private modalService: ModalService,
    private  transferService: TransferService,
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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
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

  createForm() {
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

  getAllShop() {
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
  searchShopSender() {
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

  displayShopSender(shop: Shop) {
    return shop.shop_name
  }

  // matAutoComplete for receiver site
  searchShopReceiver() {
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

  displayShopReceiver(shop: Shop) {
    return shop.shop_name;
  }

  initProductTableSelected() {
    this.tableService.setTableValue(this.table);
  }

  openModal(id: string) {
    if (id === this.productId && this.informationForm.valid) {
      console.log(this.informationForm.value);
      this.getProductInStock();
    }
    this.modalService.showModal(id);
  }

  getProductInStock() {
    this.subscription.add(
      this.transferService.getProductsInStock(this.informationForm.value['shopSender']['shop_uuid']).subscribe((response: ApiResponse) => {
        console.log(response);
      })
    )
  }
}
