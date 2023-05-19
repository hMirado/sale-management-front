import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Table } from '../../models/table/table.model';
import { NewColValue } from '../../models/table/validations/new-col-value';

@Injectable({
  providedIn: 'root'
})
export class TableauService {
  public table$: Subject<Table> = new Subject<Table>();
  private tableInputValue$: Subject<any> = new Subject<any>();
  private newColumnValue$: Subject<NewColValue> = new Subject<NewColValue>();
  
  constructor() { }

  getTable(): Subject<Table> {
    return this.table$;
  }

  setTable(value: Table): void {
    this.table$.next(value);
  }

  getTableInputValue(): Subject<any> {
    return this.tableInputValue$;
  }

  setTableInputValue(value: any): void {
    this.tableInputValue$.next(value);
  }

  setColumn(values: NewColValue): void {
    this.newColumnValue$.next(values)
  }

  getColumn(): Subject<NewColValue> {
    return this.newColumnValue$;
  }
}
