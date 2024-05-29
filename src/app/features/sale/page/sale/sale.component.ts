import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, filter, pairwise, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Product } from '../../models/product/product.model';
import { SaleService } from '../../services/sale/sale.service';
import { SearchService } from '../../services/search/search.service';
import { CategoryService } from '../../services/category/category.service';

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
  private searchValue: string = '';
  private categorySearchValue: number = 0;

  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  constructor(
    private saleService: SaleService,
    private searchService: SearchService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getSearchValue();
    this.getCategoryValue();
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
            this.searchValue = next;
            return this.saleService.getCategorieAndProduct(this.shopUuid, this.searchValue, this.categorySearchValue);
          } else {
            return [];
          }
        })
      ).subscribe((response: ApiResponse) => this.itemResponse(response))
    )
  }

  getCategoryValue(): void {
    this.subscription.add(
      this.categoryService.getCategory().pipe(
        switchMap((value: number) => {
          this.categorySearchValue = value;
          return this.saleService.getCategorieAndProduct(this.shopUuid, this.searchValue, this.categorySearchValue);
        })
      ).subscribe((response: ApiResponse) => this.itemResponse(response))
    );
  }

  itemResponse(response: ApiResponse): void {
    if (response.status == responseStatus.success) {
      const products = response.data.products;
      this.currentPage = products.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = products.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = products.totalPages;
      this.totalItems = products.totalItems;

      this.saleService.setCategories(response.data.categories);
      this.saleService.setProducts(products.items);
    }
  }

  goToNextPage(page: number): void {
    this.subscription.add(
      this.saleService.getCategorieAndProduct(this.shopUuid, this.searchValue, this.categorySearchValue, page)
        .subscribe((response: ApiResponse) => this.itemResponse(response))
    );
  }
}
