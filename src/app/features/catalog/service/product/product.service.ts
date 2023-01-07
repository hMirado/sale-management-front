import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import {IRow} from "../../../../shared/models/table/i-table";
import {Product} from "../../models/product/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private apiService: ApiService
  ) { }

  createProduct(data: {}): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPost(url, data)
  }

  countProduct(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product/count`;
    return this.apiService.doGet(url);
  }

  getProducts(page: number = 1): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    let params = {
      paginate: 1,
      page: page
    }
    return this.apiService.doGet(url, params)
  }

  addTableRowValue(value: Product): IRow {
    return {
      id: value.product_uuid,
      isExpandable: false,
      rowValue: [
        {
          id: value.product_uuid,
          key: 'label',
          type: 'simple',
          expand: false,
          value: {
            value: value.label,
            align: 'left'
          },
        },
        {
          id: value.product_uuid,
          key: 'code',
          type: 'simple',
          expand: false,
          value: {
            value: value.code,
            align: 'left'
          },
        },
        {
          id: value.product_uuid,
          key: 'category',
          type: 'simple',
          expand: false,
          value: {
            value: value?.category ? value.category.label : '',
            align: 'left'
          },
        },
        {
          id: value.product_uuid,
          key: 'price',
          type: 'simple',
          expand: false,
          value: {
            value: `${value.ttc_price} MGA`,
            align: 'right'
          },
        }
      ]
    }
  }

  createMultiProduct(products: Product[]): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPost(url, products)
  }
}