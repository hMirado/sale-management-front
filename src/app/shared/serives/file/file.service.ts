import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  public base64File$: BehaviorSubject<string|ArrayBuffer|null> = new BehaviorSubject<string|ArrayBuffer|null>('');
  
  constructor() { }

  convertFileToBase64(file: File) {
    let reader = new FileReader();

    reader.onloadend = () => {
      this.base64File$.next(reader.result);
    };
    reader.readAsDataURL(file);
  }

  convertBase64ToBlob(file: string) {
    const byteCharacters = window.atob(file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
