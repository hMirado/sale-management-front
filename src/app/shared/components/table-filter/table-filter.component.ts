import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinct, distinctUntilChanged, filter, of, pairwise, startWith, Subscription, switchMap } from 'rxjs';
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
  public allSelectValue: any = [];
  private subscription = new Subscription();
  private isClicked: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private tableFilterService: TableFilterService
    ) {
    }

  ngOnInit(): void {
    this.createForm();
    this.addField();
    this.filterValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.filterFormGroup = this.formBuilder.group({
      triggerValueChange: false,
      id: this.id,
      fields: this.formBuilder.array([])
    })
  }

  get fieldGroup(): FormArray {
    return this.filterFormGroup.get('fields') as FormArray;
  }

  addField() {
    this.subscription.add(
      this.tableFilterService.filterData$.subscribe((filterData: ITableFilter | null) => {
        //this.filterFormGroup.reset();
        this.fieldGroup.reset()
        this.fieldGroup.clear();
        if (filterData && filterData.id == this.id) {
          filterData.fields.forEach((fields: ITableFilterField) => {
            let defaultValue = fields.value?.filter(value => value.default)[0];
            let childFormGroup = this.formBuilder.group({
              key: [fields.key],
              label: [fields.label],
              type: [fields.type],
              placeholder: [fields.placeholder ? fields.placeholder : ''],
              field: [defaultValue?.default ? defaultValue.label : ''],
              fieldValue: [defaultValue?.default ? defaultValue.value : ''] //value
            });
            this.selectValue.push(fields.value ? fields.value : []);
            this.allSelectValue.push(fields.value ? fields.value : []);
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
          this.isClicked = false;
          let filterValue: ITableFilterSearchValue = { id: value.id, value: {} };
          this.chips = [];
          value.fields.forEach((field: any) => {
            const search = field.fieldValue === null ? '' : field.fieldValue;
            if (search != '') this.chips.push(search)
            let formValue: any = {};
            //formValue[field.key] = search;

            filterValue.value[field.key] = search;
          })
          return of(filterValue);
        })
      ).subscribe(value => this.tableFilterService.setFilterFormValue(value))
    )
  }


  filterSelectValue(i: number) {
    this.fieldGroup.at(i).valueChanges.pipe(
      debounceTime(500),
      startWith(null),
      pairwise(),
      filter(x => !this.isClicked),
      switchMap(([prev, next]: [any, any]) => {
        if(prev?.field.toLowerCase() != next?.field.toLowerCase()) return of(next?.field);
        else return [];
      })
    ).subscribe(value => {
      this.selectValue[i] = this.allSelectValue[i].filter((x: any) =>x.label.toLowerCase().includes(value.toLowerCase()));
      if (value == '') this.selectValue[i] = this.allSelectValue[i];
    })
  }

  selectedValue(event: any, i: number) {
    this.isClicked = true;
    const value = event.option.value
    this.fieldGroup.at(i).patchValue({
      field: value.label,
      fieldValue: value.value
    })
    this.triggerValueChange();
    this.filterValueChange();
  }
}
