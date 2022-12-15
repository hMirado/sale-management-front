import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category/category.model';
import { SaleService } from '../../services/sale/sale.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  public categories?: Category[] = [];
  private subscription = new Subscription();
  
  constructor(
    private saleService: SaleService,
    ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCategories() {
    this.subscription.add(
      this.saleService.categories$.subscribe(categories => {
        this.categories = categories
      })
    )
  }
}
