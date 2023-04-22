import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { ICell, IRow, IRowValue, ITable, IValue } from '../../models/table/i-table';
import { TableService } from '../../serives/table/table.service';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public tableFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private tableService: TableService
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.getTableValue();
    this.getExpandedValue();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm(): void {
    this.tableFormGroup = this.formBuilder.group({
      id: [this.id, Validators.required],
      trigger: false,
      fieldGroup: this.formBuilder.array([])
    })
  }

  fieldGroup(): FormArray {
    return this.tableFormGroup.get('fieldGroup') as FormArray;
  }

  parentField(i: number): FormArray {
    return this.fieldGroup().at(i).get('parentField') as FormArray;
  }

  childField(i: number, j: number): FormArray {
    return this.parentField(i).at(j).get('childField') as FormArray;
  }

  getTableValue(): void {
    this.subscription.add(
      this.tableService.table$.pipe(
        filter((table: ITable|null|any) => table && table.id == this.id)
      ).subscribe((table: ITable) => {
        this.tables = table;
        this.initForm(table.body?.cellValue as IRow[]);
        this.haveAction = !!(table.body?.isEditable || table.body?.isSwitchable || table.body?.isDeleteable || table.body?.isViewable);
        this.expand('');
      })
    );
  }

  initForm(values: IRow[]) {
    this.fieldGroup().clear();
    values.forEach((row: IRow, i: number) => {
      let parentField = this.formBuilder.group({
        parentID: row.id,
        parentLine: i,
        parentField: this.formBuilder.array([])
      });
      let parent = parentField.get('parentField') as FormArray;
      row.rowValue.forEach((rowValue: IRowValue, j: number) => {
        let childField = this.formBuilder.group({
          childID: rowValue.id,
          childLine: j,
          expand: rowValue.expand,
          key: rowValue.key,
          childField: this.formBuilder.array([])
        });
        let child = childField.get('childField') as FormArray;
        rowValue.value.forEach((value: IValue, k: number) => {
          const formValue = this.formBuilder.group({
            valueId: k,
            type: value.type,
            value: value.value,
            badge: value?.badge || null,
            icon: value?.icon || null,
            align: value.align
          })
          child.push(formValue)
        })
        parent.push(childField)
      })
      this.fieldGroup().push(parentField)
    });
  }

  getTypeOfValue(value: any) {
    return typeof value;
  }

  expand(id: string): void {
    this.tableExpand = null;
    if (this.expanded != id)  {
      this.expanded = id;
      this.tableService.setExpandUuid(id);
    } else {
      this.expanded = '';
    }
  }

  getExpandedValue(): void {
    this.subscription.add(
      this.tableService.tableExpandedValue$.subscribe(value => {
        if (value && this.expanded != '') {
          this.tableExpand = value;
        }
      })
    );
  }

  setDetail(id: string): void {
    this.tableService.setDetailId(id);
  }

  getLineId(action: string, id: string): void {
    this.tableService.setLineId({action: action, id: id})
  }
}
