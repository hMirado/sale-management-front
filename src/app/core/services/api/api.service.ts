import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  doGet = (url: string, params?: any, headers?: any): Observable<ApiResponse> => {
    let header = new HttpHeaders()
    if( headers!=null ) {
      header = new HttpHeaders({"Accept": "Application/json", ...headers});
    }
    return this.httpClient.get<ApiResponse>(url, {params: params, headers: header});
  }

  doPost = (url: string, data?: any): Observable<ApiResponse> => {
    let header = new HttpHeaders({ Accept: 'Application/json' });
    return this.httpClient.post<ApiResponse>(url, data, { headers: header });
  }

  doPut = (url: string, data?: any): Observable<ApiResponse> => {
    let header = new HttpHeaders({ Accept: 'Application/json' });
    return this.httpClient.put<ApiResponse>(url, data, { headers: header });
  }
}
