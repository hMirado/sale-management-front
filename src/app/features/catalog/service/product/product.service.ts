import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { environment } from 'src/environments/environment';
import { IRow } from '../../../../shared/models/table/i-table';
import { Product } from '../../models/product/product.model';
import { ProductFormValue } from '../../models/product-form-value/product-form-value';

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

  createMultiProduct(products: Product[]): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPost(url, products);
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

  getProductPrice(productUuid: string, shopId: string = '') {
    const param = { shop: shopId }
    let url = `${environment['store-service']}/price/product/${productUuid}`;
    return this.apiService.doGet(url, param);
  }

  getProductByUuid(productUuid: string) {
    let url = `${environment['store-service']}/product/detail/${productUuid}`;
    return this.apiService.doGet(url);
  }

  getCategories(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/category`;
    return this.apiService.doGet(url);
  }

  updateProduct(product: ProductFormValue): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doPut(url, product);
  }

  verifyCode(code: string): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product/code/${code}`;
    return this.apiService.doGet(url);
  }

  verifyLabel(label: string): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product/label/${label}`;
    return this.apiService.doGet(url);
  }

  updatePrice(value: any): Observable<ApiResponse> {
    let url = `${environment['store-service']}/price`;
    return this.apiService.doPut(url, value);
  }

  addTableRowValue(value: Product): IRow {
    return {
      id: value.product_uuid,
      isExpandable: true,
      rowValue: [
        {
          id: value.product_uuid,
          key: 'code',
          type: 'simple',
          expand: true,
          value: {
            value: [value.code],
            align: 'left',
          },
        },
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
          key: 'shop',
          type: 'simple',
          expand: false,
          value: {
            value: [],
            align: 'left',
          },
        },
        {
          id: value.product_uuid,
          key: 'price',
          type: 'simple',
          expand: false,
          value: {
            value: [],
            align: 'right',
          },
        },
      ],
    };
  }

  getPriceRow(price: any): IRow {
    return {
      id: price['price_id'],
      isExpandable: false,
      rowValue: [
        {
          id: price['price_id'],
          key: 'code',
          type: 'simple',
          expand: true,
          value: {
            value: [],
            align: 'left',
          },
        },
        {
          id: price['price_id'],
          key: 'label',
          type: 'simple',
          expand: false,
          value: {
            value: [],
            align: 'left',
          },
        },
        {
          id: price['price_id'],
          key: 'category',
          type: 'simple',
          expand: false,
          value: {
            value: [],
            align: 'left',
          },
        },
        {
          id: price['price_id'],
          key: 'shop',
          type: 'simple',
          expand: false,
          value: {
            value: [price['shop']['shop_name']],
            align: 'left',
          },
        },
        {
          id: price['price_id'],
          key: 'price',
          type: 'simple',
          expand: false,
          value: {
            value: [this.helperService.numberFormat(price['ttc_price']/100)],
            align: 'right',
          },
        },
      ]
    }
  }
}
