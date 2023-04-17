import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { tokenKey, userInfo } from 'src/app/shared/config/constant';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { Product } from '../../models/product/product.model';
import { SaleService } from '../../services/sale/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleComponent implements OnInit, OnDestroy {
  public product!: Product;
  private subscription = new Subscription();
  private userData: any;

  constructor(
    private saleService: SaleService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
  }

  getProducts() {
    this.subscription.add(
      this.saleService.getCategorieAndProduct(this.userData.shop.shop_uuid).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.saleService.setCategories(response.data.categories)
          this.saleService.setProducts(response.data.products)
        }
      })
    );
  }

  remove(uuid: string) {
    
  }
}
