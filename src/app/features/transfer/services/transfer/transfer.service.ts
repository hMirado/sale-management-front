import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Stock } from 'src/app/features/stock/models/stock/stock.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private apiService: ApiService,
  ) { }

  getProductsInStock(shop: string, search: string = ''): Observable<ApiResponse>{
    let params: any = {
      paginate: 1,
      status: 'in',
      shop: shop
    }
    if (search != '') params['keyword'] = search 
    const url = `${environment['store-service']}/stock`;
    return this.apiService.doGet(url, params).pipe(map((response: ApiResponse) => {
      const products = response.data.items.map((stock: Stock) => {
        return {
          product_id: stock.product?.product_id,
          product_uuid: stock.product?.product_uuid,
          code: stock.product?.code,
          label: stock.product?.label,
          is_serializable: stock.product?.is_serializable,
        }
      });
      
      response.data = products
      return response
    }));
  }

  getShops(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }
}
