import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ICell, ITable } from '../../models/table/i-table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  public table$: BehaviorSubject<ITable|null> = new BehaviorSubject<ITable|null>(null);
  public expandUiid$: Subject<string> = new Subject<string>();
  public tableExpandedValue$: BehaviorSubject<ICell|null> = new BehaviorSubject<ICell|null>(null);

  constructor() { }

  setTableValue(value: ITable) {
    this.table$.next(value);
  }

  setExpandUuid (uuid: string) {
    this.expandUiid$.next(uuid);
  }

  setExpandedValue(value: ICell) {
    this.tableExpandedValue$.next(value);
  }
}
