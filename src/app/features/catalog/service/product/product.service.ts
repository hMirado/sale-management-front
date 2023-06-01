import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { environment } from 'src/environments/environment';
import { IRow } from '../../../../shared/models/table/i-table';
import { Product } from '../../models/product/product.model';
import { ProductFormValue } from '../../models/validations/product-form-value';

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
      page: _params['page'] && _params['page'] > 0 ? _params['page'] : 1,
    };
    if (_params['keyword'] && _params['keyword'] != '')
      params['search'] = _params['keyword'];
    if (
      _params['category'] &&
      _params['category'] != '' &&
      _params['category'] != 'all'
    )
      params['category'] = _params['category'];
    return this.apiService.doGet(url, params);
  }

  getProductPrice(productUuid: string, shopId: string = '') {
    
    const param = shopId != '' ?{ shop: shopId } : null;
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
      isExpandable: false,
      rowValue: [
        {
          id: value.product_uuid,
          key: 'code',
          expand: true,
          value: [
            {
              type: 'simple',
              value: value.code,
              align: 'left',
            },
          ],
        },
        {
          id: value.product_uuid,
          key: 'label',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value.label,
              align: 'left',
            },
          ],
        },
        {
          id: value.product_uuid,
          key: 'category',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value?.category ? value.category.label : '',
              align: 'left',
            },
          ],
        },
        {
          id: value.product_uuid,
          key: 'shop',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'left',
            },
          ],
        },
        {
          id: value.product_uuid,
          key: 'price',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'right',
            },
          ],
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
          expand: true,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'left',
            },
          ],
        },
        {
          id: price['price_id'],
          key: 'label',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'left',
            },
          ],
        },
        {
          id: price['price_id'],
          key: 'category',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'left',
            },
          ],
        },
        {
          id: price['price_id'],
          key: 'shop',
          expand: false,
          value: [
            {
              type: 'simple',
              value: price['shop']['shop_name'],
              align: 'left',
            },
          ],
        },
        {
          id: price['price_id'],
          key: 'price',
          expand: false,
          value: [
            {
              type: 'simple',
              value: this.helperService.numberFormat(price['ttc_price'] / 100),
              align: 'right',
            },
          ],
        },
        {
          id: price['price_id'],
          key: 'action',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'right',
            },
          ],
        },
      ],
    };
  }
}
