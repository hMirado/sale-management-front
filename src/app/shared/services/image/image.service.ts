import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private deleteImage$: Subject<any> = new Subject<any>;
  constructor() { }

  getDeleteImage(): Observable<any> {
    return this.deleteImage$;
  }

  setDeleteImage(value: any): void {
    this.deleteImage$.next(value);
  }
}
