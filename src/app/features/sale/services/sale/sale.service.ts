import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { Category } from '../../models/category/category.model';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  public category$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public product$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(
    private apiService: ApiService,
  ) { }

  getCategorieAndProduct(shopUuid: string, search: string = '', category: string = ''): Observable<ApiResponse> {
    const params = {
      paginate: 0,
      search: search,
      category: category
    }
    const url = `${environment['store-services']}/product/sale/${shopUuid}`;
    return this.apiService.doGet(url, params);
  }

  setCategory(category: Category[]) {
    this.category$.next(category);
  }

  setProduct(product: Product[]) {
    this.product$.next(product);
  }
}
