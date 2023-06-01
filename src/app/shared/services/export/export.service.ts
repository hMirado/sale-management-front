import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  public isExport$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  setIsExportValue(value: boolean) {
    this.isExport$.next(value);
  }
}
