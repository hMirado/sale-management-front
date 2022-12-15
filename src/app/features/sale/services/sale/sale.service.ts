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
  public categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public productUuid$:  BehaviorSubject<string> = new BehaviorSubject<string>('');

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

  setCategories(category: Category[]) {
    this.categories$.next(category);
  }

  setProducts(product: Product[]) {
    this.products$.next(product);
  }

  setProductUuid(productUuid: string) {
    this.productUuid$.next(productUuid);
  }
}
