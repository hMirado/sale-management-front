import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter, of, Subscription, switchMap } from 'rxjs';
import { tableFilter } from '../../config/constant';
import { ITableFilter, ITableFilterField, ITableFilterSearchValue } from '../../models/i-table-filter/i-table-filter';
import { TableFilterService } from '../../serives/table-filter/table-filter.service';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, OnDestroy {
  @Input() public id!: string;
  public chips: string[] = [];
  public tableFilter = tableFilter;
  public filterFormGroup: FormGroup;
  public selectValue: any = [];
  private subscription = new Subscription();
  
  constructor(
    private formBuilder: FormBuilder,
    private tableFilterService: TableFilterService
    ) {
      this.createForm();
    }

  ngOnInit(): void {
    this.addField();
    this.filterValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.filterFormGroup = this.formBuilder.group({
      triggerValueChange: [false],
      fields: this.formBuilder.array([])
    })
  }

  get fieldGroup(): FormArray {
    return this.filterFormGroup.get('fields') as FormArray;
  }

  addField() {
    this.subscription.add(
      this.tableFilterService.filterData$.subscribe((filterData: ITableFilter | null) => {
        this.filterFormGroup.reset();
        this.fieldGroup.reset()
        this.fieldGroup.clear();
        if (filterData && filterData.id == this.id) {
          this.filterFormGroup.addControl('id', new FormControl(filterData.id))
          filterData.fields.forEach((fields: ITableFilterField) => {
            let defaultValue = fields.value?.filter(value => value.default)[0];
            let childFormGroup = this.formBuilder.group({
              key: [fields.key],
              label: [fields.label],
              type: [fields.type],
              placeholder: [fields.placeholder ? fields.placeholder : ''],
              fieldValue: [defaultValue?.default ? defaultValue.value : '']
            });
            this.selectValue.push(fields.value ? fields.value : []);
            this.fieldGroup.push(childFormGroup);
          })
        }
      })
    );
  }

  triggerValueChange() {
    this.filterFormGroup.patchValue({triggerValueChange: true});
    this.filterFormGroup.updateValueAndValidity();    
  }

  filterValueChange() {
    this.subscription.add(
      this.filterFormGroup.valueChanges.pipe(
        filter(value => value.triggerValueChange && value.id === this.id),
        debounceTime(1000),
        switchMap(value => {
          this.filterFormGroup.patchValue({triggerValueChange: false});
          this.filterFormGroup.updateValueAndValidity();
          let filterValue: ITableFilterSearchValue = { id: value.id, value: [] };
          this.chips = [];
          value.fields.forEach((field: any) => {
            const search = field.fieldValue === null ? '' : field.fieldValue;
            if (search != '') this.chips.push(search)
            let formValue: any = {};
            formValue[field.key] = search;
            filterValue.value.push(formValue);
          })
          return of(filterValue);
        })
      ).subscribe(value => this.tableFilterService.setFilterFormValue(value))
    )
  }
}
