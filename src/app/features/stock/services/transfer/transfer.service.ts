import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ITableFilterFieldValue, ITableFilterField } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { IRow } from 'src/app/shared/models/table/i-table';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { environment } from 'src/environments/environment';
import { transferStatus } from '../../config/constant';
import { Transfer } from '../../models/transfer/transfer.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) { }

  getProducts(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/product`;
    return this.apiService.doGet(url)
  }

  getSerializationTypes(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/type`;
    return this.apiService.doGet(url)
  }

  getShops(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }

  getProductQuantity(shop: string, product: string): Observable<ApiResponse> {
    const params = {
      shop: shop,
      product: product
    };
    const url = `${environment['store-service']}/stock/product`;
    return this.apiService.doGet(url, params);
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


  getTransfer(transferUuid: string, shopUuid: string, inProgress: boolean): Observable<ApiResponse> {
    const param = {
      in_progress: +inProgress
    }
    const url = `${environment['store-service']}/transfer/${transferUuid}/shop/${shopUuid}`;
    return this.apiService.doGet(url, param);
  }

  getTableRowValue(value: Transfer, userShopIds: number[]): IRow {
    const userSender = value.user_sender.last_name.toUpperCase() + ' ' + value.user_sender.first_name;
    const statusCode = value.transfer_status.transfer_status_code.toUpperCase();
    const userReceveir = (
        statusCode == transferStatus.inProgress && value.user_sender.user_id == value.user_receiver.user_id
      ) ? '' : value.user_receiver.last_name.toUpperCase() + ' ' + value.user_receiver.first_name;
    const statusLabel = statusCode == transferStatus.inProgress ? 'info' : ( (statusCode == transferStatus.validated) ? 'success' : 'danger' );
    const x = statusCode == transferStatus.validated ? 'Valider le ' : 'Annuller le '
    // this.helperService.getDate(value?.createdAt)
    const updatedDate = value?.createdAt == value?.updatedAt ? '' : x + this.helperService.getDate(value?.updatedAt)
    return {
      id: value.transfer_uuid,
      isExpandable: false,
      rowValue: [
        {
          id: value.transfer_uuid,
          key: 'date',
          type: 'simple',
          expand: false,
          value: {
            value: [ 
              `Créer le ${this.helperService.getDate(value?.createdAt)}`,
              updatedDate
            ],
            align: 'left'
          }
        },
        {
          id: value.transfer_uuid,
          key: 'product',
          type: 'simple',
          expand: false,
          value: {
            value: [ value.product.label ],
            align: 'left'
          }
        },
        {
          id: value.transfer_uuid,
          key: 'code',
          type: 'simple',
          expand: false,
          value: {
            value: [ value.product.code ],
            align: 'left'
          }
        },
        {
          id: value.transfer_uuid,
          key: 'quantity',
          type: 'simple',
          expand: false,
          value: {
            value: [ value.transfer_quantity ],
            align: 'center'
          }
        },
        {
          id: value.transfer_uuid,
          key: 'status',
          type: 'simple',
          expand: false,
          value: {
            value: [ userShopIds.includes(value.shop_sender.shop_id) ? 'ENVOI' : 'RECEPTION' ],
            align: 'center'
          },
          badge: {
            status: true ,
            bg: 'secondary'
          },
          icon: {
            status: true,
            icon: 'fas fa-exchange-alt',
          }
        },
        {
          id: value.transfer_uuid,
          key: 'status',
          type: 'simple',
          expand: false,
          value: {
            value: [ value.transfer_status.transfer_status_label.toUpperCase() ],
            align: 'center'
          },
          badge: {
            status: true ,
            bg: statusLabel
          }
        },
        {
          id: value.transfer_uuid,
          key: 'sender',
          type: 'simple',
          expand: false,
          value: {
            value: [ 
              value.shop_sender.shop_name,
              userSender
            ],
            align: 'left'
          }
        },
        {
          id: value.transfer_uuid,
          key: 'receiver',
          type: 'simple',
          expand: false,
          value: {
            value: [ 
              value.shop_receiver.shop_name,
              userReceveir
             ],
            align: 'left'
          }
        }
      ]
    }
  }

  filter(shop: ITableFilterFieldValue[], status: ITableFilterFieldValue[]): ITableFilterField[] {
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
    ]
    return fields;
  }

  verifySerialNumber(product: string, type: number, value: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/serialization/product/${product}/type/${type}/serial/${value}`;
    return this.apiService.doGet(url);
  }

  createTransfer(value: any): Observable<ApiResponse> {
    const url = `${environment['store-service']}/transfer`;
    return this.apiService.doPost(url, value);
  }

  confirm(uuid: string, user: string, isValidate: boolean): Observable<ApiResponse> {
    const body = {
      user: user,
      isValidate: isValidate
    };
    const url = `${environment['store-service']}/transfer/${uuid}/validate`;
    return this.apiService.doPost(url, body);
  }
}
