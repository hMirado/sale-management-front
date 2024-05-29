import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public category$:  Subject<number> = new Subject<number>();

  constructor() { }

  setCategory(value: number) {
    this.category$.next(value);
  }

  getCategory(): Observable<number> {
    return this.category$;
  }
}
