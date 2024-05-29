import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category/category.model';
import { SaleService } from '../../services/sale/sale.service';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  public categories?: Category[] = [];
  private subscription = new Subscription();
  public isSelected: number = 0;

  constructor(
    private saleService: SaleService,
    private categoryService: CategoryService
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
        if (categories.length > 0) this.categories = categories;
      })
    )
  }

  choseCategory(id: number) {
    this.isSelected = id;
    this.categoryService.setCategory(id);
  }
}
