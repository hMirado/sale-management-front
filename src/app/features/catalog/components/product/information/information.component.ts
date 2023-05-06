import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Product } from '../../../models/product/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, debounceTime, filter, map, of, startWith, switchMap } from 'rxjs';
import { ProductService } from '../../../service/product/product.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Category } from '../../../models/category/category.model';
import { ProductFormValue } from '../../../models/validations/product-form-value';
import { inputTimer } from 'src/app/shared/config/constant';

@Component({
  selector: 'app-product-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {
  @Input() information!: Product;
  @Output() newInformationEvent = new EventEmitter<ProductFormValue>();
  public informationFormgroup: FormGroup;
  private subscription = new Subscription;
  public categories:Category[] = [];
  public filteredCategories: Observable<Category[]>;
  public isEditable: boolean = false;
  public formError: boolean = false;
  public codeIsExist: boolean = false;
  public labelIsExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getAllCategory();
    this.searchCategory();
    this.verifyCodeExist();
    this.verifyLabelExist()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.informationFormgroup = this.formBuilder.group({
      uuid: [this.information?.product_uuid, Validators.required],
      label: [this.information?.label, Validators.required],
      code: [this.information?.code, Validators.required],
      category: ['', Validators.required],
      serializable: [this.information.is_serializable, Validators.required],
      trigger: false
    });
  }

  getAllCategory() {
    this.subscription.add(
      this.productService.getCategories().subscribe((response: ApiResponse) => {
        this.categories = response.data;
        this.filteredCategories = of(response.data);
        const currentCategory = this.categories.filter((cat: Category) => cat.category_id == this.information.fk_category_id)[0];
        this.informationFormgroup.patchValue({category: currentCategory});
        this.informationFormgroup.updateValueAndValidity();
      })
    );
  }

  searchCategory() {
    this.informationFormgroup.controls['category'].valueChanges.pipe(
      startWith<string | Category | any>(''),
      map(value => typeof value === 'string' ? value : value.label),
      map((label: string) => label != '' ? (this.categories.filter((cat: Category) => cat.label.toLocaleLowerCase().indexOf(label.toLocaleLowerCase()) === 0)) : this.categories)
    ).subscribe((value: Category[]) => {
      this.filteredCategories = of(value)
    })
  }

  displayCategory(category: Category) {
    return category.label
  }

  enableEdit() {
    this.isEditable = true;
  }

  cancelEdit() {
    this.isEditable = false;
    this.createForm();
    this.getAllCategory();
  }

  saveInformation() {
    if (!this.informationFormgroup.valid || this.informationFormgroup.invalid) {
      this.formError = true;
      return;
    }
    this.formError = false;
    const value = this.informationFormgroup.value;
    const information = {
      product_uuid: value['uuid'],
      label: value['label'],
      code: value['code'],
      is_serializable: value['serializable'],
      fk_category_id: value['category'].category_id,
    };
    this.newInformationEvent.emit(information);
    this.isEditable = false;
  }

  triggerEvent() {
    this.informationFormgroup.patchValue({trigger: true});
    this.informationFormgroup.updateValueAndValidity();
  }

  verifyCodeExist() {
    this.subscription.add(
      this.informationFormgroup.controls['code'].valueChanges.pipe(
        debounceTime(inputTimer),
        filter(value => value != '' && this.informationFormgroup.controls['trigger'].value),
        switchMap(value => {
          return this.productService.verifyCode(value);
        })
      ).subscribe((response:ApiResponse) => {
        this.informationFormgroup.controls['trigger'].setValue(false);
        this.codeIsExist = response.data && response.data.product_uuid != this.information.product_uuid
      })
    );
  }

  verifyLabelExist() {
    this.subscription.add(
      this.informationFormgroup.controls['label'].valueChanges.pipe(
        debounceTime(inputTimer),
        filter(value => value != '' && this.informationFormgroup.controls['trigger'].value),
        switchMap(value => {
          return this.productService.verifyLabel(value);
        })
      ).subscribe((response:ApiResponse) => {
        this.informationFormgroup.controls['trigger'].setValue(false);
        this.labelIsExist = response.data && response.data.product_uuid != this.information.product_uuid
      })
    );
  }
}
