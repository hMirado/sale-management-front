import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { environment } from 'src/environments/environment';
import { IRow } from '../../../../shared/models/table/i-table';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) {}

  createProduct(data: {}): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPost(url, data);
  }

  countProduct(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product/count`;
    return this.apiService.doGet(url);
  }

  getProducts(_params: any = {}): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    let params: any = {
      paginate: 1,
      page: (_params['page'] && _params['page'] > 0) ? _params['page'] : 1
    };
    if (_params['keyword'] && _params['keyword'] != '') params['search'] = _params['keyword'];
    if (_params['category'] &&(_params['category'] != '' && _params['category'] != 'all')) params['category'] = _params['category'];
    return this.apiService.doGet(url, params);
  }

  addTableRowValue(value: Product): IRow {
    const price =
      value.high_price == value.low_price
        ? this.helperService.numberFormat(value.high_price as number)
        : this.helperService.numberFormat(value.low_price as number) +
          ' - ' +
          this.helperService.numberFormat(value.high_price as number);
          
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
            value: [value.label],
            align: 'left',
          },
        },
        {
          id: value.product_uuid,
          key: 'code',
          type: 'simple',
          expand: false,
          value: {
            value: [value.code],
            align: 'left',
          },
        },
        {
          id: value.product_uuid,
          key: 'category',
          type: 'simple',
          expand: false,
          value: {
            value: value?.category ? [value.category.label] : [''],
            align: 'left',
          },
        },
        {
          id: value.product_uuid,
          key: 'price',
          type: 'simple',
          expand: false,
          value: {
            value: [`${price} MGA`],
            align: 'right',
          },
        },
      ],
    };
  }

  createMultiProduct(products: Product[]): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPost(url, products);
  }
}
