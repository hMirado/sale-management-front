import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product/product.model';
import { SaleService } from '../../services/sale/sale.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  public products?: Product[] = [];
  private subscription = new Subscription();
  
  vegetables: any[] = [
    {name: 'apple'},
    {name: 'banana'},
    {name: 'strawberry'},
    {name: 'orange'},
    {name: 'kiwi'},
    {name: 'cherry'},
  ];
  
  constructor(
    private saleService: SaleService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts() {
    this.subscription.add(
      this.saleService.product$.subscribe(products => {
        this.products = products;
      })
    )
  }
}
