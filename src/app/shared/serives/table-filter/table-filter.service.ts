import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITableFilter, ITableFilterSearchValue } from '../../models/i-table-filter/i-table-filter';

@Injectable({
  providedIn: 'root'
})
export class TableFilterService {
  filterData$:BehaviorSubject<ITableFilter|null> = new BehaviorSubject<ITableFilter|null>(null);
  filterFormValue$: BehaviorSubject<ITableFilterSearchValue|null> = new BehaviorSubject<ITableFilterSearchValue|null>(null);

  constructor() { }

  setFilterData(filterData: ITableFilter) {
    this.filterData$.next(filterData);
  }

  setFilterFormValue(value: ITableFilterSearchValue) {
    this.filterFormValue$.next(value);
  }
}
