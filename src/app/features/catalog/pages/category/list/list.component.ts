import { Component, OnDestroy, OnInit } from '@angular/core';
import {filter, iif, Subscription, switchMap} from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { tableCategoryHeader, tableCategoryId } from '../../../config/constant';
import { Category } from '../../../models/category/category.model';
import { CategoryService } from '../../../service/category/category.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ModalService} from "../../../../../shared/serives/modal/modal.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { ITableFilter, ITableFilterField, ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { TableFilterService } from 'src/app/shared/serives/table-filter/table-filter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public title: string = 'Catégories d\'articles';
  public breadCrumbs: BreadCrumb[] = [];
  public categoryFormGroup!: FormGroup;
  private subscription = new Subscription();
  public categoryNumber: number = 0;
  public uniqueId: string = 'category-id';
  public tableId: string = tableCategoryId
  private rows: IRow[] = [];
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  public infoBoxCategoryCount!: IInfoBox;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private tableFilterService: TableFilterService,
    private router: Router
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.countCategories();
    this.getCategories();
    this.addLabel();
    this.cancel();
    this.filter();
    this.getFilterValue();
    this.getLineId();
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
        label: 'Catégories d\'articles'
      }
    ]
  }

  createForm() {
    this.categoryFormGroup = this.formBuilder.group({
      category: this.formBuilder.array([])
    })
  }

  get categoryForm(): FormArray {
    return this.categoryFormGroup.get('category') as FormArray;
  }

  addLabel() {
    this.categoryForm.push(this.formBuilder.group({
      code: ['', Validators.required],
      label: ['', Validators.required]
    }))
  }

  removeLabel(i: number) {
    this.categoryForm.removeAt(i);
  }

  cancel() {
    this.subscription.add(
      this.modalService.isCanceled$.subscribe((status: boolean) => {
        if (status) {
          this.categoryFormGroup.reset();
          this.categoryForm.clear();
          this.addLabel()
        }
      })
    )
  }

  saveCategory() {
    const categories = this.categoryFormGroup.value;
    this.subscription.add(
      this.categoryService.createCategory(categories.category).subscribe((response: ApiResponse) => {
        this.modalService.hideModal(this.uniqueId);
        this.categoryFormGroup.reset();
        this.categoryForm.clear();
        this.addLabel();
        if (response.status == responseStatus.created) {
          this.showNotification('success', response.notification);
          this.getCategories()
          this.countCategories();
        } else if(response.status == responseStatus.error) {
          this.showNotification('error', response.notification);
        }
      })
    );
  }

  countCategories() {
    this.subscription.add(
      this.categoryService.countCategories().subscribe((response: ApiResponse) => {
        if (response.status == responseStatus.success) {
          this.categoryNumber = response.data;
          this.infoBoxCategoryCount =  {
            id: 'catalog',
            bg: 'bg-info',
            icon :'fa-layer-group',
            number: this.categoryNumber,
            text: 'Catégorie(s) d\'article(s)'
          }
        }
      })
    );
  }

  getCategories() {
    this.subscription.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          const page: number = params['page']
          return iif(() => Boolean(page), this.categoryService.getCategories(1, page), this.categoryService.getCategories(1))
        })
      ).subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
    )
  }

  getCategoriesResponse(response: ApiResponse) {
    let table: ITable = {
      id: this.tableId,
      header: [],
      body: null,
    }
    if (response.status == responseStatus.success) {
      this.rows = [];
      let categories: Category[] = response.data.items;
      categories.forEach((category: Category) => {
        let row: IRow = this.categoryService.addTableRowValue(category);
        this.rows.push(row);
      });
      let cells: ICell = {
        cellValue: this.rows,
        isViewable: true,
      };
      table.header = tableCategoryHeader;
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

  openModal = () => {
    this.modalService.showModal(this.uniqueId)
  }

  filter() {
    let categorieFilter: ITableFilter = { id: 'category-filter', title: '', fields: [] }
    const fields: ITableFilterField[] = [
      {
        key: 'keyword',
        label: "Mots clé",
        type: 'input',
        placeholder: 'Catégorie / Code catégorie'
      }
    ]
    categorieFilter['fields'] = fields;
    this.tableFilterService.setFilterData(categorieFilter)
  }

  private keyword: string = '';
  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'category-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.rows = []
          this.keyword = filter?.value['keyword']
          return this.categoryService.getCategories(1, 1, this.keyword)
        })
      ).subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
    );
  }

  goToNextPage(page: number){
    this.categoryService.getCategories(1, page, this.keyword).subscribe((response: ApiResponse) => this.getCategoriesResponse(response))
  }

  getLineId() {
    this.subscription.add(
      this.tableService.getlineId().subscribe((value: any) => {
        if (value && value['id'] != '' && value['action'] == 'view') this.router.navigateByUrl(`/catalog/category/${value['id']}`);
      })
    );
  }
}
