import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tab$: BehaviorSubject<String> = new BehaviorSubject<String>('');

  constructor() { }

  setTab(tabId: string) {
    this.tab$.next(tabId)
  }

  getTab(): Observable<String> {
    return this.tab$;
  }
}
