import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Table } from '../../models/table/table.model';
import { NewColValue } from '../../models/table/validations/new-col-value';
import { Line } from '../../models/table/body/line/line.model';

@Injectable({
  providedIn: 'root'
})
export class TableauService {
  public table$: BehaviorSubject<Table | null> = new BehaviorSubject<Table | null>(null);
  private tableInputValue$: Subject<any> = new Subject<any>();
  private newColumnValue$: Subject<NewColValue> = new Subject<NewColValue>();
  private tableAction$: Subject<any> = new Subject<any>();
  private expandedId$: Subject<string> = new Subject<string>();
  private expandedLineValues$: Subject<Line[]> = new Subject<Line[]>();
  
  constructor() { }

  getTable(): BehaviorSubject<Table | null> {
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

  setAction(value: any): void {
    this.tableAction$.next(value)
  }

  getAction(): Subject<any> {
    return this.tableAction$;
  }

  setExpandedId(value: string): void {
    this.expandedId$.next(value)
  }

  getExpandedId(): Subject<string> {
    return this.expandedId$
  }

  getExpandedLineValues(): Subject<Line[]> {
    return this.expandedLineValues$;
  }

  setExpandedLineValues(lines: Line[]) {
    this.expandedLineValues$.next(lines)
  }
}
