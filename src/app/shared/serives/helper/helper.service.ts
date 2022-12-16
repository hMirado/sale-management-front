import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ExportService } from '../export/export.service';
import { FileService } from '../file/file.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private exportService: ExportService,
    private fileService: FileService,
  ) { }

  reset() {
    this.exportService.isExport$.next(false);
    this.fileService.base64File$.next({file: null, id: ''});
  }

  decodeJwtToken(token: string): any{
    const helper = new JwtHelperService();
    const data = helper.decodeToken(token);
    return data;
  }
}
