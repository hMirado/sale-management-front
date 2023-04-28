import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { ICell, IRow, IRowValue, ITable, IValue } from '../../models/table/i-table';
import { TableService } from '../../services/table/table.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        filter((table: ITable|null|any) => table && table.id == this.id),
        //tap((x: any) => console.log(x))
      ).subscribe((table: ITable) => {
        this.tables = table;
        this.initForm(table.body?.cellValue as IRow[], table.body?.paginate as boolean);
        this.haveAction = !!(table.body?.isEditable || table.body?.isSwitchable || table.body?.isDeleteable);
        this.expand('');
      })
    );
  }

  initForm(values: IRow[], paginate: boolean) {
    if(paginate) this.fieldGroup().clear();
    values?.forEach((row: IRow, i: number) => {
      console.log();
      
      if (this.fieldGroup().value.length > 0 && this.fieldGroup().value.find((value: any) => value['id'] == row.id) ) {
        return;
      }
      const id: string =  row.id;
      let parentField = this.formBuilder.group({
        id: id,
        parentLine: i,
        parentField: this.formBuilder.array([])
      });
      let parent = parentField.get('parentField') as FormArray;
      row.rowValue.forEach((rowValue: IRowValue, j: number) => {
        let childField = this.formBuilder.group({
          id: id,
          childLine: j,
          expand: rowValue.expand,
          key: rowValue.key,
          childField: this.formBuilder.array([])
        });
        let child = childField.get('childField') as FormArray;
        rowValue.value.forEach((value: IValue, k: number) => {
          const formValue = this.formBuilder.group({
            id: id,
            rowId: k,
            type: value.type,
            value: value.value,
            align: value.align,
            badge: value?.badge || null,
            icon: value?.icon || null,
            button: value?.button || null,
          })
          child.push(formValue)
        })
        parent.push(childField)
      })
      this.fieldGroup().push(parentField)
    });
  }

  getTypeOfValue(value: any): any {
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

  getInputValue(event: any) {
    const id = event['id'].split('-');
    const i = id[1];
    const j = id[2];
    const k = id[3];
    if (event['isValid']) {
      this.childField(i, j).at(k).patchValue({value: event['value']});
      this.childField(i, j).updateValueAndValidity();
    }
    
    const value = {
      tableId: this.id,
      id: this.childField(i, j).at(k).value['id'],
      value: this.childField(i, j).at(k).value['value']
    }
    this.tableService.setInputValue(value);
  }
}
