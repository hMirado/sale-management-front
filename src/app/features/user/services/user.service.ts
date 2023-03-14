import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService: ApiService
  ) { }

  getRoles() {
    let url = `${environment['store-service']}/role`;
    return this.apiService.doGet(url);
  }

  getShopByStatus() {
    let url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url, {status: true});
  }
}
