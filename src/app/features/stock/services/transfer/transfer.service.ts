import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private apiService: ApiService
  ) { }

  getProducts(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/product`;
    return this.apiService.doGet(url)
  }

  getSerializationTypes(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/type`;
    return this.apiService.doGet(url)
  }

  getShops(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url);
  }
}
