import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBase64File } from '../../models/file/i-base64-file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  public base64File$: BehaviorSubject<IBase64File> = new BehaviorSubject<IBase64File>({file: null, id: ''});
  public csvLineCount$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  constructor() { }

  convertFileToBase64(file: File, id:string) {
    let reader = new FileReader();
    reader.onloadend = () => {
      const data: IBase64File = {
        file: reader.result,
        id: id
      }
      this.base64File$.next(data);
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
