import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import {
  ITableFilterFieldValue,
  ITableFilter,
} from 'src/app/shared/models/i-table-filter/i-table-filter';
import { Role } from 'src/app/shared/models/role/role.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { IRow } from 'src/app/shared/models/table/i-table';
import { environment } from 'src/environments/environment';
import { UserFormValue } from '../models/validation/user-form-value';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoValue: Subject<User | null> = new Subject<User | null>();
  private userCreated: Subject<User> = new Subject<User>();
  private userShop: Subject<any | null> = new Subject<any | null>();
  constructor(private apiService: ApiService) {}

  nextUserInfoValue(value: User | null): void {
    this.userInfoValue.next(value);
  }

  getUserValue(): Observable<User | null> {
    return this.userInfoValue;
  }

  nextUserCreated(userCreated: User): void {
    this.userCreated.next(userCreated);
  }

  getUserCreated(): Observable<User> {
    return this.userCreated;
  }

  nextUserShop(value: any | null): void {
    this.userShop.next(value);
  }

  getUserShop(): Observable<any | null> {
    return this.userShop;
  }

  getRoles(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/role`;
    return this.apiService.doGet(url);
  }

  getShopByStatus(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url, { status: true });
  }

  createUser(user: User): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user`;
    return this.apiService.doPost(url, user);
  }

  getAllShop(): Observable<ApiResponse> {
    const param = { status: true };
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url, param);
  }

  addUserShop(value: {
    user: number;
    shops: number[];
  }): Observable<ApiResponse> {
    let url = `${environment['store-service']}/user/add-shop`;
    return this.apiService.doPost(url, value);
  }

  getUserFilter(roles: Role[], shops: Shop[]): ITableFilter {
    const roleFilter: ITableFilterFieldValue[] = [
      {
        key: 'role',
        label: 'Tous',
        value: 'all',
        default: true,
      },
      ...roles.map((role: Role) => {
        return {
          key: 'role',
          label: role.role_name,
          value: role.role_uuid,
        };
      }),
    ];
    const shopFilter: ITableFilterFieldValue[] = [
      {
        key: 'shop',
        label: 'Tous',
        value: 'all',
        default: true,
      },
      ...shops.map((shop: Shop) => {
        return {
          key: 'shop',
          label: shop.shop_name,
          value: shop.shop_uuid,
        };
      }),
    ];
    let filter: ITableFilter = { id: 'user-filter', title: '', fields: [] };
    filter.fields = [
      {
        key: 'search',
        label: 'Mots clé',
        type: 'input',
        placeholder: "Nom / prénom(s) de l'utilisateur",
      },
      {
        key: 'shop',
        label: 'Shop',
        type: 'autoComplete',
        value: shopFilter,
      },
      {
        key: 'role',
        label: 'Role',
        type: 'autoComplete',
        value: roleFilter,
      },
    ];
    return filter;
  }

  getUsers(_params: any = {}): Observable<ApiResponse> {
    let params: any = {
      paginate: 1,
      page: _params['page'] && _params['page'] > 0 ? _params['page'] : 1,
    };
    if (_params['search'] && _params['search'] != '')
      params['search'] = _params['search'];
    if (_params['shop'] && _params['shop'] != '' && _params['shop'] != 'all')
      params['shop'] = _params['shop'];
    if (_params['role'] && _params['role'] != '' && _params['role'] != 'all')
      params['role'] = _params['role'];
    const url = `${environment['store-service']}/user`;
    return this.apiService.doGet(url, params);
  }

  getTableRowValue(user: User): IRow {
    const name = user.last_name?.toUpperCase() + ' ' + user.first_name;
    const shop = user.shops?.map((shop: Shop) => shop.shop_name) as any;

    return {
      id: user.user_uuid as string,
      isExpandable: false,
      rowValue: [
        {
          id: user.user_uuid as string,
          key: 'name',
          expand: false,
          value: [
            {
              type: 'simple',
              value: name,
              align: 'left',
            },
          ],
        },
        {
          id: user.user_uuid as string,
          key: 'phone',
          expand: false,
          value: [
            {
              type: 'simple',
              value: user.phone_number ? user.phone_number : '',
              align: 'left',
            },
          ],
        },
        {
          id: user.user_uuid as string,
          key: 'shop',
          expand: false,
          value: [
            {
              type: 'simple',
              value: shop.length > 2 ? '. . .' : shop,
              align: 'left',
            },
          ],
        },
        {
          id: user.user_uuid as string,
          key: 'name',
          expand: false,
          value: [
            {
              type: 'simple',
              value: user?.role?.role_name ? user?.role?.role_name : '',
              align: 'left',
            },
          ],
        },
      ],
    };
  }

  countUser(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user/statistic/count`;
    return this.apiService.doGet(url);
  }

  getUserByUuid(uuid: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user/${uuid}`;
    return this.apiService.doGet(url);
  }

  updatUser(user: UserFormValue): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user/update`;
    return this.apiService.doPut(url, user);
  }

  updateUserShop(shop: any): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user/update-shop`;
    return this.apiService.doPost(url, shop);
  }

  getRole(roleUuid: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/role/${roleUuid}`;
    return this.apiService.doGet(url);
  }

  resetPassword(userUuid: string): Observable<ApiResponse> {
    const url = `${environment['store-service']}/user/${userUuid}/reset-password`;
    return this.apiService.doPut(url);
  }
}
