import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import {
  ITableFilterField,
  ITableFilterFieldValue,
} from 'src/app/shared/models/i-table-filter/i-table-filter';
import { IRow } from 'src/app/shared/models/table/i-table';
import { environment } from 'src/environments/environment';
import { Stock } from '../../models/stock/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private apiService: ApiService) {}

  getProducts(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doGet(url);
  }

  getAttributeTypes(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/attribute-type`;
    return this.apiService.doGet(url);
  }

  getSerializationTypes(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/type`;
    return this.apiService.doGet(url);
  }

  addStock(value: any): Observable<ApiResponse> {
    let url = `${environment['store-service']}/stock`;
    return this.apiService.doPost(url, value);
  }

  getStocks(shop: string = '', _params: any = {}): Observable<ApiResponse> {
    let params: any = {
      paginate: 1,
      page: _params['page'] && _params['page'] > 0 ? _params['page'] : 1,
    };
    if (shop != '') params['shop'] = shop;
    else if (_params['shop'] && _params['shop'] != 'all')
      params['shop'] = _params['shop'];
    if (_params['keyword'] && _params['keyword'] != '')
      params['keyword'] = _params['keyword'];
    if (_params['status'] && _params['status'] != 'all')
      params['status'] = _params['status'];
    if (_params['serialization'] && _params['serialization'] != 'all')
      params['serialization'] = _params['serialization'];

    let url = `${environment['store-service']}/stock`;
    return this.apiService.doGet(url, params);
  }

  addTableRowValue(value: Stock): IRow {
    return {
      id: value.stock_uuid,
      isExpandable: (value.product?.is_serializable &&
        value?.quantity > 0) as boolean,
      rowValue: [
        {
          id: value.stock_uuid,
          key: 'product',
          expand: (value.product?.is_serializable &&
            value?.quantity > 0) as boolean,
          value: [
            {
              type: 'simple',
              value: value?.product?.label as string,
              align: 'left',
            },
          ],
        },
        {
          id: value.stock_uuid,
          key: 'code',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value?.product?.code as string,
              align: 'left',
            },
          ],
        },
        {
          id: value.stock_uuid,
          key: 'status',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value?.quantity > 0 ? 'En Stock' : 'En rupture',
              align: 'center',
              badge: {
                status: true,
                bg: value?.quantity > 0 ? 'success' : 'danger',
              },
            },
          ],
        },
        {
          id: value.stock_uuid,
          key: 'quantity',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value?.quantity.toString(),
              align: 'center',
            },
          ],
        },
        {
          id: value.stock_uuid,
          key: 'shop',
          expand: false,
          value: [
            {
              type: 'simple',
              value: value?.shop?.shop_name ? value?.shop?.shop_name : '',
              align: 'left',
            },
          ],
        },
        {
          id: value.stock_uuid,
          key: 'serialization',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
              align: 'left',
            },
          ],
        },
      ],
    };
  }

  getProductSerialization(productUuid: string, shopUuid: string = '') {
    let param: any = { is_sold: false };
    if (shopUuid != '') param['shop'] = shopUuid;

    const url = `${environment['store-service']}/serialization/shop/product/${productUuid}`;
    return this.apiService.doGet(url, param);
  }

  addTableRowSerializationValue(serialisationDisctinct: any): IRow {
    const serializationValues = serialisationDisctinct['value'].map((value: string) => {
      return {
        type: 'simple',
        value: value,
        align: 'left',
      }
    })
    return {
      id: serialisationDisctinct['id'],
      isExpandable: false,
      rowValue: [
        {
          id: serialisationDisctinct['id'],
          key: 'product',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
            },
          ],
        },
        {
          id: serialisationDisctinct['id'],
          key: 'code',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
            },
          ],
        },
        {
          id: serialisationDisctinct['id'],
          key: 'status',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
            },
          ],
        },
        {
          id: serialisationDisctinct['id'],
          key: 'quantity',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
            },
          ],
        },
        {
          id: serialisationDisctinct['id'],
          key: 'shop',
          expand: false,
          value: [
            {
              type: 'simple',
              value: '',
            },
          ],
        },
        {
          id: serialisationDisctinct['id'],
          key: 'product',
          expand: false,
          value: serializationValues,
        },
      ],
    };
  }

  getShops(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }

  filter(
    _shop: ITableFilterFieldValue[] = [],
    status: ITableFilterFieldValue[],
    serialization: ITableFilterFieldValue[]
  ): ITableFilterField[] {
    const fields: ITableFilterField[] = [
      {
        key: 'keyword',
        label: 'Mots clé',
        type: 'input',
        placeholder: 'Article / Code article',
      },
      {
        key: 'status',
        label: 'Statut',
        type: 'autoComplete',
        value: status,
      },
      {
        key: 'serialization',
        label: 'Sérialisé',
        type: 'autoComplete',
        value: serialization,
      },
    ];

    if (_shop.length > 0) {
      const shop: ITableFilterField = {
        key: 'shop',
        label: 'Shop',
        type: 'autoComplete',
        value: _shop,
      };
      fields.splice(1, 0, shop);
    }
    return fields;
  }

  countStock(shop: string = ''): Observable<ApiResponse> {
    let param: any = {};
    if (shop != '') param['shop'] = shop;
    const url = `${environment['store-service']}/stock/count`;
    return this.apiService.doGet(url, param);
  }
}
