import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product/product.model';
import { SaleService } from '../../../services/sale/sale.service';

@Component({
  selector: 'app-sale-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() public product!: Product;
  @Input() public isAdded: boolean = false;

  constructor(
    private saleService: SaleService
  ) { }

  ngOnInit(): void {

  }

  getStockStatus() {
    return (this.product.stock && this.product.stock > 0) ? true : false;
  }

  getStockText() {
    return (this.product.stock && this.product.stock > 0) ? 'En stock' : 'Rupture';
  }

  addProduct(product: Product) {
    this.saleService.setProductUuid(product.product_uuid);
    this.isAdded = true;
  }

  removeProduct(product: Product) {
    this.isAdded = false;
  }
}
