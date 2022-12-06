import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'app-sale-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() public product!: Product;
  constructor() { }

  ngOnInit(): void {
    
  }

  getStockStatus() {
    return (this.product.stock && this.product.stock.quantity > 0) ? true : false;
  }

  getStockText() {
    return (this.product.stock && this.product.stock.quantity > 0) ? 'En stock' : 'Rupture';
  }

  addProduct(product: Product) {
    console.log(product);
  }

  removeProduct(product: Product) {
    console.log(product);
  }
}
