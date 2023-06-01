import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ExportService } from '../export/export.service';
import { FileService } from '../file/file.service';
import * as CryptoJS from 'crypto-js';
import { tokenFromUI } from '../../config/constant';

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

  numberFormatDigit(value: number) {
    return value.toLocaleString('fr-Fr', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  numberFormat(value: number) {
    return value.toLocaleString('fr-Fr')
  }

  getDate(dateUTC: Date) {
    const date = new Date(dateUTC);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth()).slice(-2);
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const second = date.getSeconds();
    return `${day}-${month}-${year} ${hours}:${minutes}:${second}`;
  }

  encrypt(data: string) {
    let encrypted = CryptoJS.AES.encrypt(data, tokenFromUI);
    return encrypted.toString();
  }

  decrypt(data: string) {
    let decrypted = CryptoJS.AES.decrypt(data, tokenFromUI);
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}
