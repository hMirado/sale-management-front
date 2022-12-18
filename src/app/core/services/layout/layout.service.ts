import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private apiService: ApiService
  ) { }

  logout(): Observable<ApiResponse> {
    const url = `${environment['store-service']}/authentication/logout`;
    return this.apiService.doGet(url)
  }
}
