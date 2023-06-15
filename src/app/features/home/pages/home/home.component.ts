import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { Button } from 'src/app/shared/models/button/button.model';
import { HomeService } from '../../services/home/home.service';
import { authorizations, userInfo } from 'src/app/shared/config/constant';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Router } from '@angular/router';
import { Authorization } from 'src/app/shared/models/authorization/authorization.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public title: string = 'Tableau de bord';
  public breadCrumbs: BreadCrumb[] = [];
  public buttonMakeSale: Button = {
    id: 'sale',
    label: 'Faire une vente',
    color: 'secondary'
  };
  public buttonOpenShop: Button = {
    id: 'open',
    label: 'Ouvrir un shop',
    color: 'primary'
  };
  private subscription = new Subscription();
  private userData: any = {};
  public shopIsOpen: boolean = false;
  public openShopId: string = 'open-shop';
  public closeShopId: string = 'close-shop';
  public singleShop: boolean = true;

  constructor(
    private homeService: HomeService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.addHeaderContent();
    this.configButton();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Tableau de bord'
      },
    ]
  }

  configButton() {
    this.buttonOpenShop.action = this.openShopModal;
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
    this.getAction(this.userData.role.authorizations);
  }

  getAction(_authorizations: []) {
    const isSingle = _authorizations.filter((authorization: Authorization) => authorization.authorization_key == authorizations.shop.element.singleAction)[0];
    this.singleShop = isSingle ? true : false;
    if (this.singleShop) this.getShopIsOpen();
  }

  openModal(id: string) {
    this.modalService.showModal(id)
  }

  closeModal(id: string) {
    this.modalService.hideModal(id)
  }
  
  openShopModal = () => {
    this.openModal(this.openShopId)
  }

  getShopIsOpen() {
    this.subscription.add(
      this.homeService.getShopByUuid(this.userData.shops[0].shop_uuid).subscribe((response: ApiResponse) => {
        const isOpen = response.data.is_opened;
        if (isOpen) this.shopIsOpenButton();
        else this.shopIsCloseButton();
      })
    );
  }

  shopIsOpenButton() {
    this.shopIsOpen = true;
    this.buttonOpenShop.action = this.closeShop;
    this.buttonOpenShop.color = 'danger';
    this.buttonOpenShop.label = 'Fermer shop'
    this.buttonMakeSale.color = 'success';
    this.buttonMakeSale.action = this.makeSale;
    this.localStorageService.setLocalStorage('shop', this.userData.shops[0].shop_uuid);
  }

  shopIsCloseButton() {
    this.shopIsOpen = false;
    this.buttonOpenShop.action = this.openShopModal;
    this.buttonOpenShop.color = 'primary';
    this.buttonOpenShop.label = 'Ouvrir un shop'
    this.buttonMakeSale.color = 'secondary';
    this.buttonMakeSale.action = () => {};
    this.localStorageService.removeLocalStorage('shop');
  }

  openShop() {
    this.subscription.add(
      this.homeService.openShop(this.userData.shops[0].shop_uuid, true).subscribe((response: ApiResponse) => {
        this.shopIsOpenButton();
        this.closeModal(this.openShopId);
      })
    );
  }

  choseShopSaleModal() {
    console.log('CHOSE SHOP');
    this.buttonMakeSale.color = 'success';
    this.buttonMakeSale.action = this.makeSale;
  }

  closeShop = () => {
    this.subscription.add(
      this.homeService.openShop(this.userData.shops[0].shop_uuid, false).subscribe((response: ApiResponse) => {
        this.shopIsCloseButton();
      })
    );
  }

  makeSale = () => {
    this.router.navigate(['sale']);
  }
}
