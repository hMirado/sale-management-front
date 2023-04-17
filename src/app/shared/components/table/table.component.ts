import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ICell, ITable } from '../../models/table/i-table';
import { TableService } from '../../serives/table/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() id: string = '';
  private subscription = new Subscription();
  public tables!: ITable;
  public haveAction: boolean = false;
  public expanded: string = '';
  public tableExpand: ICell|null = null;

  constructor(
    private tableService: TableService
  ) { }

  ngOnInit(): void {
    this.getTableValue();
    this.getExpandedValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTableValue() {
    this.subscription.add(
      this.tableService.table$.subscribe((table: ITable|null) => {
        if (table && table.id === this.id) {
          this.tables = table;
          this.haveAction = !!(table.body?.isEditable || table.body?.isSwitchable || table.body?.isDeleteable || table.body?.isViewable);
          this.expand('');
        }
      })
    );
  }

  getTypeOfValue(value: any) {
    return typeof value;
  }

  expand(id: string) {
    this.tableExpand = null;
    if (this.expanded != id)  {
      this.expanded = id;
      this.tableService.setExpandUuid(id);
    } else {
      this.expanded = '';
    }
  }

  getExpandedValue() {
    this.subscription.add(
      this.tableService.tableExpandedValue$.subscribe(value => {
        if (value && this.expanded != '') {
          this.tableExpand = value;
        }
      })
    );
  }

  setDetail(id: string) {
    this.tableService.setDetailId(id);
  }

  getLineId(action: string, id: string) {
    this.tableService.setLineId({action: action, id: id})
  }
}
