import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, Subscription, switchMap } from 'rxjs';
import { Category } from '../../models/category/category.model';
import { SaleService } from '../../services/sale/sale.service';

@Component({
  selector: 'app-sale-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public searchFormGroup!: FormGroup;
  public selected: string = "Catégorie d'article - Tous";

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.formValueChanged();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.searchFormGroup = this.formBuilder.group({
      select: [''],
      search: [''],
      triggerEvent: false
    })
  }


  triggerEvent() {
    this.searchFormGroup.patchValue({ triggerEvent: true });
    this.searchFormGroup.updateValueAndValidity();
  }

  formValueChanged() {
    this.subscription.add(
      this.searchFormGroup.valueChanges.pipe(
        filter(value => value.triggerEvent),
        debounceTime(1000),
        switchMap(value => {
          console.log(value);
          
          return []
        })
      ).subscribe()
    );
  }
}
