import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITable } from '../../models/table/i-table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  public table$: BehaviorSubject<ITable|null> = new BehaviorSubject<ITable|null>(null);

  constructor() { }

  setTableValue(value: ITable) {
    this.table$.next(value);
  }
}
