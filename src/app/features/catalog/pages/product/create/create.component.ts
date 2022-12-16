import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreadCrumb} from "../../../../../shared/models/bread-crumb/bread-crumb.model";
import {debounceTime, map, Observable, startWith, Subscription, switchMap} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {ProductService} from "../../../service/product/product.service";
import {ApiResponse} from "../../../../../core/models/api-response/api-response.model";
import {responseStatus} from "../../../../../core/config/constant";
import {Product} from "../../../models/product/product.model";
import {CategoryService} from "../../../service/category/category.service";
import {Category} from "../../../models/category/category.model";
import {NotificationService} from "../../../../../core/services/notification/notification.service";

@Component({
  selector: 'app-product-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  public title: string = 'Création d\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();

  public producFormGroup!: FormGroup;
  public attributeFormGroup!: FormGroup;

  @ViewChild('stepper') stepper!: MatStepper;

  public categories: Category[] = []
  public formError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.addAttribute();
    this.getCategories();
    this.getCategoriesValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Catalogues',
      },
      {
        url: '',
        label: 'Création d\'articles'
      }
    ]
  }

  createForm() {
    this.producFormGroup = this.formBuilder.group({
      code: ['', Validators.required],
      label: ['', Validators.required],
      ttcPrice: ['', Validators.required],
      isSerializable: '',
      category: ['', Validators.required],
    });

    this.attributeFormGroup = this.formBuilder.group({
      attribute: this.formBuilder.array([])
    })
  }

  get attribute(): FormArray {
    return this.attributeFormGroup.get('attribute') as FormArray;
  }

  serialization(i: number): FormArray {
    return this.attribute.at(i).get('serialization') as FormArray
  }

  addAttribute() {
    this.attribute.push(
      this.formBuilder.group({
        camera: '',
        graphicCard: '',
        processor: '',
        ram: '',
        storage: '',
        storageType: '',
        product: ['', Validators.required],
        serialization: this.formBuilder.array([
          {
            serialization: ['', Validators.required],
            product: ['', Validators.required],
            serializationType: [1, Validators.required],
          }
        ])
      })
    )
  }

  getCategories() {
    this.subscription.add(
      this.categoryService.getCategories().subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
    );
  }

  getCategoriesValueChange() {
    const category = this.producFormGroup?.get('category')
    if (category) {
      this.subscription.add(
        category.valueChanges.pipe(
          debounceTime(500),
          switchMap((category: string) => {
            return this.categoryService.getCategories(1)
          })
        ).subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
      );
    }
  }

  getCategoriesResponse(response: ApiResponse) {
    if (response.status == responseStatus.success) {
      this.categories = response.data.items;
    }
  }

  saveProduct(event: any) {
    if (this.producFormGroup.valid) {
      this.formError = false
      const selectedCategory = this.categories.filter(item => item.label == this.producFormGroup.get('category')?.value)[0];
      const ttcPrice = this.producFormGroup.get('ttcPrice')?.value;
      const product = new Product();
      product.code = this.producFormGroup.get('code')?.value;
      product.label = this.producFormGroup.get('label')?.value;
      product.ht_price = ttcPrice - (ttcPrice * 0.2);
      product.ttc_price = ttcPrice;
      product.is_serializable = this.producFormGroup.get('isSerializable')?.value;
      product.fk_category_id = selectedCategory.category_id;
      this.createProduct(product)
    } else {
      this.formError = true
    }
  }

  /**
   * @param product
   */
  createProduct(product: Product) {
    this.subscription.add(
      this.productService.createProduct(product).subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.stepper.next();
        }
      })
    );
  }


  /**
   * @description Notification
   * @param type
   * @param message
   */
  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
