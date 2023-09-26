import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private isExport$: Subject<any> = new Subject<any>();

  constructor() { }

  setIsExportValue(value: any): void {
    this.isExport$.next(value);
  }

  getIsExportValue(): Observable<any> {
    return this.isExport$;
  }
}