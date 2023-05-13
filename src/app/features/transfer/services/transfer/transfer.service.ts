import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Stock } from 'src/app/features/stock/models/stock/stock.model';
import { IRow, InputValue } from 'src/app/shared/models/table/i-table';
import { environment } from 'src/environments/environment';
import { Product as TransfertProduct } from '../../models/validations/product'
import { Transfer as TransferValidation } from '../../models/validations/transfer';
import { Transfer } from '../../models/transfer/transfer.model';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { status } from '../../config/constant';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private selectedProduct$: Subject<TransfertProduct> = new Subject<TransfertProduct>();
  private quantity$: Subject<Number> = new Subject<Number>();
  private saveSerialization$: Subject<boolean> = new Subject<boolean>();
  private productSerialization$: Subject<TransfertProduct> = new Subject<TransfertProduct>();
  
  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) { }

  getProductsInStock(shop: string, search: string = ''): Observable<ApiResponse>{
    let params: any = {
      paginate: 1,
      status: 'in',
      shop: shop
    }
    if (search != '') params['keyword'] = search 
    const url = `${environment['store-service']}/stock`;
    return this.apiService.doGet(url, params).pipe(map((response: ApiResponse) => {
      const products = response.data.items.map((stock: Stock) => {
        return {
          product_id: stock.product?.product_id,
          product_uuid: stock.product?.product_uuid,
          code: stock.product?.code,
          label: stock.product?.label,
          is_serializable: stock.product?.is_serializable,
        }
      });
      
      response.data = products
      return response
    }));
  }

  getShops(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }

  getTableRowValue(product: Product): IRow {
    return {
      id: product.product_uuid,
      isExpandable: false,
      rowValue: [
        {
          id: product.product_uuid,
          key: 'label',
          expand: false,
          value: [
            {
              type: 'simple',
              value: product.label,
              align: 'left',
            },
          ],
        },
        {
          id: product.product_uuid,
          key: 'quantity',
          expand: false,
          value: [
            {
              type: 'input-number',
              value: "1",
              align: 'center',
            },
          ],
        },
        {
          id: product.product_uuid,
          key: 'serialization',
          expand: false,
          value: [
            {
              type: product.is_serializable ? 'button' : 'simple',
              value: product.is_serializable ? 'Numéro de série' : 'Aucun numéro de série a renseigné.',
              align: 'left'
            },
          ],
        }
      ]
    }
  }

  verifyStock(shop: string, product: string, value: InputValue): Observable<ApiResponse> {
    const url = `${environment['store-service']}/stock/shop/${shop}/product/${product}`;
    return this.apiService.doGet(url).pipe(
      map((response: ApiResponse) => {
        const quantity = +value.value
        response.data = {
          product: value.id,
          quantityIsValid: response.data.quantity >= quantity,
          quantityInput: quantity,
          quantityRemaining: response.data.quantity
        }
        return response
      })
    );
  }

  setSelectedProduct(product: TransfertProduct):void {
    this.selectedProduct$.next(product);
  }

  getSelectedProduct(): Observable<TransfertProduct> {
    return this.selectedProduct$;
  }

  setQuantity(qty: Number):void {
    this.quantity$.next(qty);
  }

  getQuantity(): Observable<Number> {
    return this.quantity$;
  }

  getSerialization(shop: string, product: string, search: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/serialization/shop/product/${product}`;
    const param = {
      shop: shop,
      search: search,
      is_sold: false
    };
    return this.apiService.doGet(url, param);
  }


  setSaveSerialization(status: boolean):void {
    this.saveSerialization$.next(status);
  }

  getSaveSerialization(): Observable<boolean> {
    return this.saveSerialization$;
  }

  setProductSerialization(product: TransfertProduct): void {
    this.productSerialization$.next(product);
  }

  getProductSerialization(): Observable<TransfertProduct> {
    return this.productSerialization$;
  }

  create(value: TransferValidation): Observable<ApiResponse> {
    const url = `${environment['store-service']}/transfer`;
    return this.apiService.doPost(url, value);
  }

  getTransfers(currentShop: string = '', currentUser: string = '', _params: any = {}): Observable<ApiResponse> {
    const params: any = {
      paginate: 1,
      page: (_params['page'] && _params['page'] > 0) ? _params['page'] : 1
    };
    if (currentShop != '') params['currentShop'] = currentShop;
    if (currentUser != '') params['currentUser'] = currentUser;
    if (_params['keyword'] && _params['keyword']) params['keyword'] = _params['keyword'];
    if (_params['shop'] && (_params['shop'] != '' && _params['shop'] != 'all')) params['shop'] = _params['shop'];
    if (_params['status'] && (_params['status'] != '' && _params['status'] != 'all')) params['status'] = _params['status'];
    const url = `${environment['store-service']}/transfer`
    return this.apiService.doGet(url, params);
  }

  getTransferTableRowValue(transfer: Transfer): IRow {
    const userSender = transfer.user_sender.last_name.toLocaleUpperCase() + ' ' + transfer.user_sender.first_name;
    const transferStatus = transfer.transfer_status;
    const userReceiver = (
      transferStatus.transfer_status_code == status.inProgress && transfer.user_sender.user_id == transfer.user_receiver.user_id
    ) ? '' : transfer.user_receiver.last_name.toUpperCase() + ' ' + transfer.user_receiver.first_name;
    return {
      id: transfer.transfer_uuid,
      isExpandable: false,
      rowValue: [
        {
          id: transfer.transfer_uuid,
          key: 'date',
          expand: false,
          value: [
            {
              type: 'simple',
              value: this.helperService.getDate(transfer?.createdAt),
              align: 'left',
            },
          ],
        },
        {
          id: transfer.transfer_uuid,
          key: 'code',
          expand: false,
          value: [
            {
              type: 'simple',
              value: transfer.transfer_code.toLocaleUpperCase(),
              align: 'left',
            },
          ],
        },
        {
          id: transfer.transfer_uuid,
          key: 'status',
          expand: false,
          value: [
            {
              type: 'simple',
              value: transferStatus.transfer_status_label.toLocaleUpperCase(),
              align: 'center',
              badge: {
                status: true,
                bg: transferStatus.transfer_status_code == status.inProgress ? 'info' : 'success'
              }
            },
          ],
        },
        {
          id: transfer.transfer_uuid,
          key: 'shopSender',
          expand: false,
          value: [
            {
              type: 'simple',
              value: transfer.shop_sender.shop_name,
              align: 'left',
            }
          ],
        },
        {
          id: transfer.transfer_uuid,
          key: 'shopSender',
          expand: false,
          value: [
            {
              type: 'simple',
              value: transfer.shop_receiver.shop_name,
              align: 'left',
            }
          ],
        },
      ]
    }
  }

  getTransfer(uuid: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/transfer/${uuid}`;
    return this.apiService.doGet(url);
  }
}
