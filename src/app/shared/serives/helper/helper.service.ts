import { Injectable } from '@angular/core';
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
}
