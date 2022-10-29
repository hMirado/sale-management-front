import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private apiService: ApiService
  ) { }

  importCategory(file:  string|ArrayBuffer|null): Observable<ApiResponse> {
    let url = `${environment['catalog-services']}/category/import`;
    let data: Object = {
      file: file
    }

    return this.apiService.doPost(url, data);
  }

  exportModel() {
    let url = `${environment['catalog-services']}/category//export-model`;
    return this.apiService.doGet(url);
  }

  countCategories(): Observable<ApiResponse> {
    let url = `${environment['catalog-services']}/category/count`;

    return this.apiService.doGet(url);
  }
}
