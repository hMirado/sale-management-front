import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
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

  constructor(
    private saleService: SaleService
  ) { }

  ngOnInit(): void {
    this.getProducts()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts() {
    this.subscription.add(
      this.saleService.getCategorieAndProduct('ae229430-e5a0-4cb1-b3a9-5b15e168d1fa').subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.saleService.setCategory(response.data.categories)
          this.saleService.setProduct(response.data.products)
        }
      })
    );
  }
}
