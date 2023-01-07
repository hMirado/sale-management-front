import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';

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
}
