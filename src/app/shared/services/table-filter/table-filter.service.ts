import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITableFilter, ITableFilterSearchValue } from '../../models/i-table-filter/i-table-filter';

@Injectable({
  providedIn: 'root'
})
export class TableFilterService {
  filterData$:BehaviorSubject<ITableFilter|null> = new BehaviorSubject<ITableFilter|null>(null);
  filterFormValue$: Subject<ITableFilterSearchValue> = new Subject<ITableFilterSearchValue>();

  constructor() { }

  setFilterData(filterData: ITableFilter) {
    this.filterData$.next(filterData);
  }

  setFilterFormValue(value: ITableFilterSearchValue) {
    this.filterFormValue$.next(value);
  }
}
