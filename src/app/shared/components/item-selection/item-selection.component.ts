import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { ItemSelectionService } from '../../services/item-selection/item-selection.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { ITableFilter } from '../../models/i-table-filter/i-table-filter';
import { TableFilterService } from '../../services/table-filter/table-filter.service';

@Component({
  selector: 'app-item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss']
})
export class ItemSelectionComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  private subscription = new Subscription();
  public products: Product[] = [];
  public selectedProducts: Product[] = [];
  public currentProducts: Product[] = [];

  constructor(
    private itemSelectionService: ItemSelectionService,
    private tableFilterService: TableFilterService
  ) { }

  ngOnInit(): void {
    this.productFilter();
    this.getProducts();
    this.getIsValidateSelectedProduct();
    this.getSelectedProduct();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  productFilter(): void {
    let filter: ITableFilter = { 
      id: this.id, 
      title: '', 
      fields: [
        {
          key: 'keyword',
          label: "Mots clé",
          type: 'input',
          placeholder: 'Article / Code article'
        }
      ]
    }
    this.tableFilterService.setFilterData(filter)
  }

  getProducts(): void {
    this.subscription.add(
      this.itemSelectionService.getProducts().subscribe((value: { id: string; products: Product[]; } | null) => {
        this.products = [];
        if (this.id == value?.id) {
          this.products = value.products;
        }
      })
    );
  }

  selectProduct(product: Product): void {
    const isSelected = this.selectedProducts.find((item: Product) => item.product_id == product.product_id);
    if (isSelected) {
      this.selectedProducts = this.selectedProducts.filter((item: Product) => item.product_id != product.product_id);
    } else {
      this.selectedProducts = [... this.selectedProducts, product];
    }
  }

  productIsSelected(product: Product): boolean {
    const isSelected = this.selectedProducts.find((item: Product) => item.product_id == product.product_id);
    return isSelected ? true : false;
  }

  removeProduct(product: Product) {
    this.selectedProducts = this.selectedProducts.filter((item: Product) => item.product_id != product.product_id);
  }

  getIsValidateSelectedProduct() {
    this.subscription.add(
      this.itemSelectionService.getValidateSelectedProduct().subscribe((isValid: boolean) => {
        if (isValid) {
          this.itemSelectionService.setSelectedProducts({
            id: this.id,
            products: this.selectedProducts
          });
          this.currentProducts = this.selectedProducts;
        }
      })
    );
  }

  getSelectedProduct() {
    this.subscription.add(
      this.itemSelectionService.getCancelSelectedProduct().subscribe((isCanceled: boolean) => {
        if (isCanceled) this.selectedProducts = this.currentProducts;
      })
    );
  }
}