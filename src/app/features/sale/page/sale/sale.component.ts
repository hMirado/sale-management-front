import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, filter, pairwise, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from '../../models/product/product.model';
import { SaleService } from '../../services/sale/sale.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleComponent implements OnInit, OnDestroy {
  public product!: Product;
  private subscription = new Subscription();
  private shopUuid: string = '';
  public shopName: string = '';

  constructor(
    private saleService: SaleService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getSearchValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts(): void {
    this.subscription.add(
      this.saleService.userSession().pipe(
        switchMap((response: ApiResponse) => {
          if (response.data) {
            this.shopName = response.data.shop.shop_name;
            this.shopUuid = response.data.shop.shop_uuid;
            return this.saleService.getCategorieAndProduct(this.shopUuid);
          } else {
            return [];
          }
        })
      ).subscribe((response: ApiResponse) => this.itemResponse(response))
    );
  }

  getSearchValue(): void {
    this.subscription.add(
      this.searchService.getSearch().pipe(
        pairwise(),
        switchMap(([prev, next]: [any, any]) => {
          if (prev != next) {
            return this.saleService.getCategorieAndProduct(this.shopUuid, next)
          } else {
            return [];//this.saleService.getCategorieAndProduct(this.shopUuid, value)
          }
        })
      ).subscribe((response: ApiResponse) => this.itemResponse(response))
    )
  }

  itemResponse(response: ApiResponse): void {
    if (response.status == responseStatus.success) {
      this.saleService.setCategories(response.data.categories);
      this.saleService.setProducts(response.data.products.items);
    }
  }
}
