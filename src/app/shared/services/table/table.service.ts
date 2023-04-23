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
  private detailId$: Subject<string> = new Subject<string>();
  private lineId$: Subject<any> = new Subject<any>();

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

  setDetailId(uuid: string) {
    this.detailId$.next(uuid);
  }

  getDetailId() {
    return this.detailId$;
  }

  setLineId(value: any) {
    this.lineId$.next(value);
  }

  getlineId() {
    return this.lineId$;
  }
}
