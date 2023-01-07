import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { IRow } from 'src/app/shared/models/table/i-table';
import { environment } from 'src/environments/environment';
import { Stock } from '../../models/stock/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private apiService: ApiService
  ) { }

  getProducts(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doGet(url)
  }

  getAttributeTypes(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/attribute-type`;
    return this.apiService.doGet(url)
  }

  getSerializationTypes(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/type`;
    return this.apiService.doGet(url)
  }

  addStock(value: any, shop: string): Observable<ApiResponse> {
    let url = `${environment['store-service']}/stock/${shop}`;
    return this.apiService.doPost(url, value)
  }

  getStocks(shop: string, page: number = 1): Observable<ApiResponse> {
    let url = `${environment['store-service']}/stock/${shop}`;
    return this.apiService.doGet(url)
  }

  addTableRowValue(value: Stock): IRow {
    return {
      id: value.stock_uuid,
      isExpandable: value.product?.is_serializable as boolean,
      rowValue: [
        {
          id: value.stock_uuid,
          key: 'product', 
          type: 'simple',
          expand: value.product?.is_serializable as boolean,
          value: {
            value: value?.product?.label as string,
            align: 'left'
          }
        },
        {
          id: value.stock_uuid,
          key: 'code', 
          type: 'simple',
          expand: false,
          value: {
            value: value?.product?.code as string,
            align: 'left'
          } 
        },
        {
          id: value.stock_uuid,
          key: 'status', 
          type: 'simple',
          expand: false,
          value: {
            value: value?.quantity > 0 ? 'En Stock' : 'En rupture',
            align: 'center'
          },
          badge: {
            status: value?.quantity > 0 ? true : false,
            bg: value?.quantity > 0 ? 'success' : 'danger'
          }
        },
        {
          id: value.stock_uuid,
          key: 'quantity', 
          type: 'simple',
          expand: false,
          value: {
            value: value?.quantity ,
            align: 'center'
          }
        },
        {
          id: value.stock_uuid,
          key: 'serialization', 
          type: 'simple',
          expand: false,
          value: {
            value: '',
            align: 'left'
          }
        },
      ]
    }
  }
}
