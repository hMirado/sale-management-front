import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public search$:  BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  setSearch(value: string) {
    this.search$.next(value);
  }

  getSearch(): Observable<string> {
    return this.search$;
  }
}
