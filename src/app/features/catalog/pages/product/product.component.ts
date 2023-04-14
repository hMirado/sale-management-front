import { Component, OnDestroy, OnInit } from '@angular/core';
import {debounceTime, filter, iif, of, Subscription, switchMap} from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { tableProductHeader, tableProductId } from '../../config/constant';
import { ProductService } from '../../service/product/product.service';
import { TableService } from "../../../../shared/serives/table/table.service";
import { ICell, IRow, ITable } from "../../../../shared/models/table/i-table";
import { Product } from "../../models/product/product.model";
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { Category } from '../../models/category/category.model';
import { CategoryService } from '../../service/category/category.service';
import { ITableFilter, ITableFilterFieldValue, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { TableFilterService } from 'src/app/shared/serives/table-filter/table-filter.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  public title: string = 'Articles';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public productNumber: number = 0;
  public uniqueIdProduct: string = 'product-id';
  public tableId: string = tableProductId;
  private rows: IRow[] = [];
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public infoBoxProductCount!: IInfoBox;
  public productFormGroup!: FormGroup;
  public categories: Category[] = [];
  public searchCategories: Category[] = [];
  public formError: boolean = false;
  public modalConfirmationID: string = 'confirm-id';
  public created: number = 0;
  public error: number = 0;
  public errorValues: any[] = [];
  private params: any = {};

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private tableService: TableService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private categoryService: CategoryService,
    private tableFilterService: TableFilterService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.addHeaderContent();
    this.countProduct();
    this.getProducts();
    this.addFormField();
    this.cancel();
    this.getCategories();
    this.getFilterValue();
  }

  ngOnDestroy(): void {
    this.helperService.reset();
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil',
      },
      {
        label: 'Catalogues',
      },
      {
        label: 'Articles'
      }
    ]
  }

  countProduct() {
    this.subscription.add(
      this.productService.countProduct().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.productNumber = response.data;
          this.infoBoxProductCount =  {
            id: 'product',
            bg: 'bg-info',
            icon: ' fa-gamepad',
            number: this.productNumber,
            text: 'Total article(s)'
          }
        }
      })
    );
  }

  getProducts() {
    this.subscription.add(
      this.productService.getProducts().subscribe((response: ApiResponse) => this.getProductsResponse(response))
    );
  }

  getProductsResponse(response: ApiResponse) {
    let table: ITable = {
      id: this.tableId,
      header: [],
      body: null
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      let products: Product[] = response.data.items;
      products.forEach((product: Product) => {
        let row: IRow = this.productService.addTableRowValue(product);
        this.rows.push(row);
      });
      let cells: ICell = {
        cellValue: this.rows,
        isViewable: true,
      };
      table.header = tableProductHeader;
      table.body = cells;
      this.tableService.setTableValue(table);
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
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

  openModal(id: string) {
    this.modalService.showModal(id)
  }

  closeModal(id: string) {
    this.modalService.hideModal(id)
  }

  createForm() {
    this.productFormGroup = this.formBuilder.group({
      product: this.formBuilder.array([]),
    });
  }

  get productForm(): FormArray {
    return this.productFormGroup.get('product') as FormArray;
  }

  addFormField() {
    this.searchCategories = this.categories;
    this.productForm.push(
      this.formBuilder.group({
        code: ['', Validators.required],
        label: ['', Validators.required],
        isSerializable: false,
        category: ['', Validators.required]
      })
    )
  }

  removeLabel(i: number) {
    this.productForm.removeAt(i);
    this.searchCategories = this.categories;
  }

  cancel() {
    this.subscription.add(
      this.modalService.isCanceled$.subscribe((status: boolean) => {
        if (status) {
          this.productFormGroup.reset();
          this.productForm.clear();
          this.addFormField();
          this.searchCategories = this.categories;
        }
      })
    )
  }

  getCategories() {
    this.subscription.add(
      this.categoryService.getCategories().subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
    );
  }

  getCategoriesResponse(response: ApiResponse) {
    if (response.status == responseStatus.success) {
      this.categories = response.data;
      this.searchCategories = response.data;
      this.productFilter(this.categories);
    }
  }

  getCategoriesValueChange(i: number) {
    this.searchCategories = this.categories;
    const category = this.productForm?.at(i).get('category')
    if (category) {
      this.subscription.add(
        category.valueChanges.pipe(
          debounceTime(500),
          switchMap((category: string) => {
            if (category == '') {
             return of(this.categories)
            } else {
              this.searchCategories = this.categories.filter(x =>  x.label.toLowerCase().includes(category.toLowerCase()));
              const result = this.categories.filter(x =>  x.label.toLowerCase().includes(category.toLowerCase()));
              return of(result);
            }
          })
        ).subscribe(response => {
          this.searchCategories = response
        })
      );
    }
  }

  createItems() {
    if (!this.productForm.valid) {
      this.formError = true;
    } else {
      this.formError = false;
      const products = this.productForm.value.map((x: any) => {
        return {
          code: x.code,
          label: x.label,
          is_serializable: x.isSerializable,
          fk_category_id: this.categories.filter(category => category.label.toLowerCase == x.category.toLowerCase)[0].category_id
        }
      })
      this.saveItems(products);
    }
  }

  saveItems(products: Product[]) {
    this.subscription.add(
      this.productService.createMultiProduct(products).subscribe((response:ApiResponse) => {
        if (response.status == responseStatus.created) {
          this.created = response.data.successCount;
          this.error = response.data.errorCount;
          this.errorValues = response.data.errors;
          this.productFormGroup.reset();
          this.productForm.clear();
          this.closeModal(this.uniqueIdProduct);
          this.openModal(this.modalConfirmationID);
        }
      })
    );
  }

  closeConfirmModal() {
    this.closeModal(this.modalConfirmationID);
    this.created = 0;
    this.error = 0;
    this.errorValues = [];
    this.countProduct();
    this.getProducts();
    this.getCategories();
  }

  productFilter(categories: Category[]) {
    const categorieFilter: ITableFilterFieldValue[] = [
      {
        key: 'category',
        label: 'Tous',
        value: 'all',
        default: true
      }, 
      ...categories.map((category: Category) => {
        const filter = {
          key: 'category',
          label: category.label,
          value: category.category_uuid
        }
        return filter;
      })
    ];
    
    let filter: ITableFilter = { id: 'product-filter', title: '', fields: [] };
    filter.fields = [
      {
        key: 'keyword',
        label: "Mots clé",
        type: 'input',
        placeholder: 'Article / Code article'
      },
      {
        key: 'category',
        label: "Catégories",
        type: 'autoComplete',
        value: categorieFilter,
      }
    ];
    this.tableFilterService.setFilterData(filter);
  }

  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'product-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.rows = [];
          this.params['page'] = 1;
          this.params = { ...this.params, ... filter?.value };
          return this.productService.getProducts(this.params);
        })
      ).subscribe((response: ApiResponse) => this.getProductsResponse(response))
    );
  }

  goToNextPage(page: number){
    this.params['page'] = page;
    this.productService.getProducts(this.params).subscribe((response: ApiResponse) => this.getProductsResponse(response));
  }
}
