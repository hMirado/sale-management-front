import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { IFilterFieldValue } from 'src/app/shared/models/i-filter/i-filter-field-value';
import { ITableFilter, ITableFilterField, ITableFilterFieldValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
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

  getStocks(shop: string = '', _params: any = {}): Observable<ApiResponse> {
    let params: any = { 
      paginate: 1,
      page: (_params['page'] && _params['page'] > 0) ? _params['page'] : 1
    }
    if(shop != '') params['shop'] = shop;
    else if (_params['shop'] && _params['shop'] != 'all' ) params['shop'] = _params['shop'];
    if (_params['keyword'] && _params['keyword'] != '' )params['keyword'] = _params['keyword'];
    if (_params['status'] && _params['status'] != 'all' )params['status'] = _params['status'];
    if (_params['serialization'] && _params['serialization'] != 'all' )params['serialization'] = _params['serialization'];

    let url = `${environment['store-service']}/stock`;
    return this.apiService.doGet(url, params)
  }

  addTableRowValue(value: Stock): IRow {
    return {
      id: value.stock_uuid,
      isExpandable: (value.product?.is_serializable && value?.quantity > 0) as boolean,
      rowValue: [
        {
          id: value.stock_uuid,
          key: 'product', 
          type: 'simple',
          expand: (value.product?.is_serializable && value?.quantity > 0) as boolean,
          value: {
            value:[ value?.product?.label as string],
            align: 'left'
          }
        },
        {
          id: value.stock_uuid,
          key: 'code', 
          type: 'simple',
          expand: false,
          value: {
            value: [value?.product?.code as string],
            align: 'left'
          } 
        },
        {
          id: value.stock_uuid,
          key: 'status', 
          type: 'simple',
          expand: false,
          value: {
            value: value?.quantity > 0 ? ['En Stock'] : ['En rupture'],
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
            value: [value?.quantity] ,
            align: 'center'
          }
        },
        {
          id: value.stock_uuid,
          key: 'shop', 
          type: 'simple',
          expand: false,
          value: {
            value: [value?.shop?.shop_name],
            align: 'left'
          }
        },
        {
          id: value.stock_uuid,
          key: 'serialization', 
          type: 'simple',
          expand: false,
          value: {
            value: [''],
            align: 'left'
          }
        }
      ]
    }
  }

  getProductSerialization(productUuid: string, shopUuid: string = '') {
    let param: any = {is_slod: '0'}
    if ( shopUuid != '') param['shop'] = shopUuid;
   
    const url = `${environment['store-service']}/serialization/shop/product/${productUuid}`;
    return this.apiService.doGet(url, param)
  }

  addTableRowSerializationValue(serialisationDisctinct: any): IRow {
    return {
      id: serialisationDisctinct['id'],
      isExpandable: false,
      rowValue: [
        {
          id: serialisationDisctinct['id'],
          key: 'product', 
          type: 'simple',
          expand: false,
          value: {
            value: ['']
          }
        },
        {
          id: serialisationDisctinct['id'],
          key: 'code', 
          type: 'simple',
          expand: false,
          value: {
            value: ['']
          }
        },
        {
          id: serialisationDisctinct['id'],
          key: 'status', 
          type: 'simple',
          expand: false,
          value: {
            value: ['']
          }
        },
        {
          id: serialisationDisctinct['id'],
          key: 'quantity', 
          type: 'simple',
          expand: false,
          value: {
            value: ['']
          }
        },
        {
          id: serialisationDisctinct['id'],
          key: 'shop', 
          type: 'simple',
          expand: false,
          value: {
            value: ['']
          }
        },
        {
          id: serialisationDisctinct['id'],
          key: 'product', 
          type: 'simple',
          expand: false,
          value: {
            value: serialisationDisctinct['value'],
            align: 'left'
          }
        },
      ]
    }
  }

  getShops(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }

  filter(shop: ITableFilterFieldValue[], status: ITableFilterFieldValue[], serialization: ITableFilterFieldValue[]): ITableFilterField[] {
    const fields: ITableFilterField[] = [
      {
        key: 'keyword',
        label: "Mots clé",
        type: 'input',
        placeholder: 'Article / Code article'
      },
      {
        key: 'shop',
        label: "Shop",
        type: 'select',
        value: shop,
      },
      {
        key: 'status',
        label: "Statut",
        type: 'select',
        value: status,
      },
      {
        key: 'serialization',
        label: "Sérialisé",
        type: 'select',
        value: serialization,
      },
    ]
    return fields;
  }

  countStock(shop: string = ''): Observable<ApiResponse> {
    let param: any = {}
    if (shop != '') param['shop'] = shop;
    const url = `${environment['store-service']}/stock/count`;
    return this.apiService.doGet(url, param)
  }
}
