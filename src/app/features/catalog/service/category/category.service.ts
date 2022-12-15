import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { IRow } from 'src/app/shared/models/table/i-table';
import { environment } from 'src/environments/environment';
import { Category } from '../../models/category/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private apiService: ApiService
  ) { }

  importCategory(file:  string|ArrayBuffer|null): Observable<ApiResponse> {
    let url = `${environment['store-services']}/category/import`;
    let data: Object = {
      file: file
    }

    return this.apiService.doPost(url, data);
  }

  createCategory(categories: Category[]) {
    let url = `${environment['store-services']}/category`;
    return this.apiService.doPost(url, categories)
  }

  exportModel(): Observable<ApiResponse> {
    let url = `${environment['store-services']}/category/export-model`;
    return this.apiService.doGet(url);
  }

  countCategories(): Observable<ApiResponse> {
    let url = `${environment['store-services']}/category/count`;
    return this.apiService.doGet(url);
  }

  getCategories(page: number = 1): Observable<ApiResponse> {
    let url = `${environment['store-services']}/category`;
    let params = {
      page: page
    }
    return this.apiService.doGet(url, params)
  }

  addTableRowValue(value: Category): IRow {
    return {
      id: value.category_uuid,
      isExpandable: false,
      rowValue: [
        {
          id: value.category_uuid,
          key: 'label',
          type: 'simple',
          expand: false,
          value: value.label,
        },
        {
          id: value.category_uuid,
          key: 'code',
          type: 'simple',
          expand: false,
          value: value.code.toUpperCase(),
        },
        {
          id: value.category_uuid,
          key: 'total',
          type: 'simple',
          expand: false,
          value:  value.products ? value.products.length : 0,
        },
      ]
    }
  }
}
