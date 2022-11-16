import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import {IRow} from "../../../../shared/models/table/i-table";
import {Product} from "../../models/product/product.model";
import {Category} from "../../models/category/category.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private apiService: ApiService
  ) { }

  importProduct(file:  string|ArrayBuffer|null): Observable<ApiResponse> {
    let url = `${environment['catalog-services']}/product/import`;
    let data: Object = {
      file: file
    }

    return this.apiService.doPost(url, data)
  }

  exportModel(): Observable<ApiResponse>{
    let url = `${environment['catalog-services']}/product/export-model`;
    return this.apiService.doGet(url);
  }

  countProduct(): Observable<ApiResponse> {
    let url = `${environment['catalog-services']}/product/count`;
    return this.apiService.doGet(url);
  }


  getProducts(page: number = 1): Observable<ApiResponse> {
    let url = `${environment['catalog-services']}/product`;
    let params = {
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
          value: value.label,
        },
        {
          id: value.product_uuid,
          key: 'code',
          type: 'simple',
          expand: false,
          value: value.code,
        },
        {
          id: value.product_uuid,
          key: 'category',
          type: 'simple',
          expand: false,
          value: value.category.label,
        },
        {
          id: value.product_uuid,
          key: 'price',
          type: 'simple',
          expand: false,
          value: value.ttc_price,
        }
      ]
    }
  }
}
