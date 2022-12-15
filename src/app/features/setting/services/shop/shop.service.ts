import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from '../../../../../environments/environment'
import { Shop } from '../../models/shop/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  public shops$: BehaviorSubject<Shop[]> = new BehaviorSubject<Shop[]>([]);
  public updateStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * @description get all Shop
   * @returns Shop
   */
  getShops(): Observable<ApiResponse> {
    return this.apiService.doGet(`${environment['store-services']}/shop`);
  }

  nextShopsValue(shops: Shop[]): void {
    this.shops$.next(shops);
  }

  /**
   * @description update shop status
   * @param shop_uuid 
   * @param shop 
   * @returns boolean
   */
  updateShopStatus(shop_uuid: string, shop: Object): Observable<ApiResponse> {
    let url = `${environment['store-services']}/shop/${shop_uuid}/status`;
    return this.apiService.doPut(url, shop);
  }

  nextUpdateStatus(value: any): void {
    this.updateStatus$.next(value);
  }

  /**
   * @description update shop
   * @param shop_uuid
   * @param shop 
   * @returns boolean
   */
  updateShop(shop_uuid: string, shop: Shop): Observable<ApiResponse> {
    let url = `${environment['store-services']}/shop/${shop_uuid}`;
    return this.apiService.doPut(url, shop);
  }

  createShop(shop: Shop): Observable<ApiResponse> {
    let url = `${environment['store-services']}/shop`;
    return this.apiService.doPost(url, shop);
  }
}
