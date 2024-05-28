import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { Category } from '../../models/category/category.model';
import { Product } from '../../models/product/product.model';
import { Line } from 'src/app/shared/models/table/body/line/line.model';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { Serialization } from 'src/app/features/stock/models/serialization/serialization.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  public categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public productUuid$:  BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) { }

  getCategorieAndProduct(shopUuid: string, search: string = '', category: string = ''): Observable<ApiResponse> {
    const params = {
      paginate: 0,
      search: search,
      category: category
    }
    const url = `${environment['store-service']}/product/sale/${shopUuid}`;
    return this.apiService.doGet(url, params);
  }

  setCategories(category: Category[]) {
    this.categories$.next(category);
  }

  setProducts(product: Product[]) {
    this.products$.next(product);
  }

  setProductUuid(productUuid: string) {
    this.productUuid$.next(productUuid);
  }

  getCountSale(shop: string|null = null): Observable<ApiResponse> {
    const url = `${environment['store-service']}/sale/count/${shop ? shop : ''}`;
    return this.apiService.doGet(url);
  }

  getSales(_params: any = {}): Observable<ApiResponse> {
    let params: any = {
      paginate: 1,
      page: _params['page'] && _params['page'] > 0 ? _params['page'] : 1
    }
    if (_params['shop'] && _params['shop'] != 'all') params['shop'] = _params['shop'];
    if (_params['keyword'] && _params['keyword'] != '') params['product'] = _params['keyword'];
    if (_params['category'] && _params['category'] != '') params['category'] = _params['category'];
    const url = `${environment['store-service']}/sale`;
    return this.apiService.doGet(url, params);
  }

  getSaleTable(sale: any): Line {
    const tooltip =  { hasTooltip: false }
    return {
      lineId: sale['sale_uuid'] +'|'+sale['serialization'],
      column: [
        {
          content: [
            {
              type: 'simple',
              key: 'item',
              value: sale['label'],
              expandable: sale['serialization'] ? true : false,
              tooltip: tooltip
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
              value: this.helperService.numberFormat(sale['sale_quantity']),
              expandable: false,
              tooltip: tooltip
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
              key: 'price',
              value: this.helperService.numberFormat(+sale['sale_price']),
              expandable: false,
              tooltip: tooltip
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
              value: sale['shop_name'],
              expandable: false,
              tooltip: tooltip
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
              key: 'date',
              value: this.helperService.getDate(sale['createdAt']),
              expandable: false,
              tooltip: tooltip
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
              tooltip: tooltip
            }
          ],
          style: {
            align: 'align-left',
            flex: 'row'
          }
        }
      ]
    }
  }

  getSelledProductSerializtion(group: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/serialization/group?group[]=${group}`;
    return this.apiService.doGet(url);
  }

  getSerializationLine(lineId: string, serializations: Serialization[]): Line {
    const tooltip =  { hasTooltip: false }
    let content: any[] = [];
    serializations.forEach((serialization: any) => {
      content.push(
        {
            type: 'simple',
            key: 'serialization',
            value: serialization,
            expandable: false,
            tooltip: tooltip
        }
      )
    })
    return {
      lineId: lineId,
      column: [
        {
          content: [
            {
              type: 'simple',
              key: 'item',
              value: '',
              expandable: false,
              tooltip: tooltip
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
              tooltip: tooltip
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
              key: 'price',
              value: '',
              expandable: false,
              tooltip: tooltip
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
              tooltip: tooltip
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
              key: 'date',
              value: '',
              expandable: false,
              tooltip: tooltip
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
            flex: 'row'
          }
        }
      ]
    }
  }
}
