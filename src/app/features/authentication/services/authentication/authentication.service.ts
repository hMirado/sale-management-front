import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { Login } from '../../models/login/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private apiService: ApiService
  ) { }

  login(login: Login): Observable<ApiResponse> {
    const url = `${environment['store-service']}/authentication/login`;
    return this.apiService.doPost(url, login);
  }

  update(uuid: string, password: string) {
    const value = {
      uuid: uuid,
      password: password
    }
    const url = `${environment['store-service']}/user/update-password`;
    return this.apiService.doPut(url, value);
  }
}
