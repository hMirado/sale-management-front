import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Image } from '../../models/image/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private deleteImage$: Subject<any> = new Subject<any>;
  private image$: BehaviorSubject<Image | null> = new BehaviorSubject<Image | null>(null);

  constructor() { }

  getDeleteImage(): Observable<any> {
    return this.deleteImage$;
  }

  setDeleteImage(value: any): void {
    this.deleteImage$.next(value);
  }

  getImage(): Observable<Image | null> {
    return this.image$;
  }

  setImage(value: Image): void {
    this.image$.next(value);
  }
}
