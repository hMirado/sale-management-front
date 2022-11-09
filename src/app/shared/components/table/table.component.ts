import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ITable } from '../../models/table/i-table';
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

  constructor(
    private tableService: TableService
  ) { }

  ngOnInit(): void {
    this.getTableValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTableValue() {
    this.subscription.add(
      this.tableService.table$.subscribe((table: ITable|null) => {
        if (table && table.id === this.id) {
          this.tables = table;
          this.haveAction = !!(table.body?.isEditable || table.body?.isSwitchable || table.body?.isDeleteable);
        }
      })
    );
  }

  getTypeOfValue(value: any) {
    return typeof value;
  }
}
