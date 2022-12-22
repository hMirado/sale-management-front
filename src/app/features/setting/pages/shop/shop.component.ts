import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { ButtonLeftMenu, IButtonLeftMenuItem } from 'src/app/shared/models/button-left-menu/button-left-menu.model';
import { Shop } from '../../models/shop/shop.model';
import { ShopService } from '../../services/shop/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  public shops: Shop[] = [];
  public buttonLeftMenu: ButtonLeftMenu = new ButtonLeftMenu();
  public defaultSelected: string = '';
  public breadCrumbs: BreadCrumb[] = [];
  public title: string = 'Boutiques';
  
  constructor(
    private shopService: ShopService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.getShops();
    this.updateStatus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.shopService.nextUpdateStatus(false);
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Mon Entreprise',
      },
      {
        url: '',
        label: 'Boutiques'
      }
    ]
  }

  getShops() {
    this.subscription.add(
      this.shopService.getShops().subscribe( (response: ApiResponse) => {
        this.shops = response.data;
        this.shopService.nextShopsValue(this.shops);
      })
    );
  }

  updateStatus() {
    this.subscription.add(
      this.shopService.updateStatus$.subscribe((status: boolean) => {
        if (status) {
          this.getShops();
          this.shopService.nextUpdateStatus(false);
        }
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
