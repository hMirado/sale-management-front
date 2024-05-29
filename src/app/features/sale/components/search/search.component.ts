import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, of, pairwise, Subscription, switchMap } from 'rxjs';
import { inputTimer } from 'src/app/shared/config/constant';
import { SearchService } from '../../services/search/search.service';

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
    private formBuilder: FormBuilder,
    private searchService: SearchService
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
      search: [''],
      trigger: false
    })
  }

  triggerEvent() {
    this.searchFormGroup.patchValue({ trigger: true });
    this.searchFormGroup.updateValueAndValidity();
  }

  formValueChanged() {
    this.subscription.add(
      this.searchFormGroup.valueChanges.pipe(
        filter(value => value.trigger),
        debounceTime(inputTimer),
        switchMap((value: any) => {
          this.searchFormGroup.patchValue({trigger: false});
          return of(value.search);
        })
      ).subscribe((value) => {
        this.searchService.setSearch(value);
      })
    );
  }
}
