import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import {
  ITableFilterField,
  ITableFilterFieldValue,
} from 'src/app/shared/models/i-table-filter/i-table-filter';
import { environment } from 'src/environments/environment';
import { Stock } from '../../models/stock/stock.model';
import { Line } from 'src/app/shared/models/table/body/line/line.model';
import { emptyColumn, sellProductColumn } from '../../config/constant';
import { Column } from 'src/app/shared/models/table/body/column/column.model';

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

  getTableStock(stock: Stock): Line {
    // const column = (!stock?.product?.is_serializable && stock.quantity >= 0) ? sellProductColumn : emptyColumn;
    let button: Column;
    if (!stock?.product?.is_serializable && stock.quantity >= 0) {
      button = {
        content: [
          {
            type: 'button',
            key: 'action',
            value: '',
            disabled: false,
            action: () => {},
            icon: {
              tooltip: {
                hasTooltip: true,
                text: 'Vendre',
                flow: 'top',
              },
              icon: 'fas fa-cash-register',
              bg: 'text-secondary',
            },
          },
        ],
        style: {
          align: 'align-center',
          flex: 'row',
        },
      };
    } else {
      button = {
        content: [
          {
            type: 'simple',
            key: 'action',
            value: '',
            expandable: false,
            tooltip: { hasTooltip: false }
          }
        ],
        style: {
          align: 'align-left',
          flex: 'row'
        }
      }
    }
    return {
      lineId: stock.stock_uuid,
      column: [
        {
          content: [
            {
              type: 'simple',
              key: 'items',
              value: stock?.product?.label || '',
              expandable: (stock.product?.is_serializable && stock?.quantity > 0) as boolean,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'code',
              value: stock?.product?.code || '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'badge',
              key: 'status',
              badge: {
                value: stock?.quantity > 0 ? 'En stock' : 'En rupture',
                bg: stock?.quantity > 0 ? 'bg-success' : 'bg-danger'
              },
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-center',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'quantity',
              value: stock?.quantity.toString(),
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-center',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'shop/' + stock?.shop?.shop_uuid,
              value: stock?.shop?.shop_name ? stock?.shop?.shop_name : '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'serialization',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        button
      ]
    }
  }

  getProductSerialization(productUuid: string, shopUuid: string = '') {
    let param: any = { is_sold: false };
    if (shopUuid != '') param['shop'] = shopUuid;
    const url = `${environment['store-service']}/serialization/shop/product/${productUuid}`;
    return this.apiService.doGet(url, param);
  }

  addTableRowSerializationValue(serialisationDisctinct: any): Line {
    const content = serialisationDisctinct['value'].map((value: string) => {
      return {
        type: 'simple',
        key: 'name',
        value: value,
        expandable: false,
        tooltip: { hasTooltip: false }
      }
    });
    
    return {
      lineId: serialisationDisctinct['id'],
      column: [
        {
          content: [
            {
              type: 'simple',
              key: 'items',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'code',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'code',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'quantity',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-center',
            flex: 'row'
          }
        },
        {
          content: [
            {
              type: 'simple',
              key: 'shop',
              value: '',
              expandable: false,
              tooltip: { hasTooltip: false }
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        },
        {
          content: content,
          style: {
            align: 'align-left',
            flex: 'column'
          }
        },
        {
          content: [
            {
              type: 'button',
              key: 'action',
              value: '',
              disabled: false,
              action: () => {},
              icon: {
                tooltip: {
                  hasTooltip: true,
                  text: 'Vendre',
                  flow: 'top',
                },
                icon: 'fas fa-cash-register',
                bg: 'text-secondary',
              },
            },
          ],
          style: {
            align: 'align-center',
            flex: 'row',
          },
        }
      ]
    }
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

  saleProductInStock(value: any) {
    const url = `${environment['store-service']}/sale`;
    return this.apiService.doPost(url, value);
  }

  getFileModel(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/stock/export`;
    return this.apiService.doGet(url);
  }

  importStock(file:  string|ArrayBuffer|null): Observable<ApiResponse> {
    let url = `${environment['store-service']}/stock/import`;
    let data: Object = {
      file: file
    }

    return this.apiService.doPost(url, data)
  }
}
