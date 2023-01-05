import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, of, Subscription, switchMap } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IExport } from 'src/app/shared/models/export/i-export';
import { IImport } from 'src/app/shared/models/import/i-import';
import { IRow } from 'src/app/shared/models/table/i-table';
import { ExportService } from 'src/app/shared/serives/export/export.service';
import { FileService } from 'src/app/shared/serives/file/file.service';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { exportStockConfig, importStockConfig, tableStockId } from '../../config/constant';
import { StockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  public title: string = 'Stock d\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  
  public importConfig: IImport = importStockConfig;
  public exportConfig: IExport = exportStockConfig;
  public uniqueId: string = 'stock-id';

  public tableId: string = tableStockId
  private rows: IRow[] = [];

  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  public products: Product[] = [];
  public searchProducts: Product[] = [];
  public stockFormGroup!: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private helperService: HelperService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.helperService.reset();
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Mes stocks d\'articles',
      }
    ]
  }

  openModal(id: string) {
    this.modalService.showModal(id);
    this.getProducts();
  }

  closeModal(id: string) {
    this.modalService.hideModal(id)
  }

  createForm() {
   this.stockFormGroup = this.formBuilder.group({
    item: ['', Validators.required],
    quantity: ['', Validators.required],
    attribute: this.formBuilder.array([])
   });
  }

  get attributeField(): FormArray {
    return this.stockFormGroup.get('attribute') as FormArray;
  }

  addAttributeField() {
    let field = this.formBuilder.group({
      graphics_card: '',
      processor: '',
      ram: '',
      storage: '',
      storage_type: '',
      serialization:  this.formBuilder.array([])
    });
    this.attributeField.push(field)
  }

  getSerializationField(i: number): FormArray {
    return this.attributeField.at(i).get('serialization') as FormArray;
  }

  addSerializationField(i: number) {
    this.getSerializationField(i).controls.push(
      this.formBuilder.group({
        type: '',
        value: ''
      })
    )
  }

  getProducts(){
    this.subscription.add(
      this.stockService.getProducts().subscribe((response: ApiResponse) => {
        switch (response.status) {
          case responseStatus.success:
            this.products = response.data;
            this.searchProducts = response.data;
            break;
        }
      })
    );
  }

  getProductValueChange() {
    const item = this.stockFormGroup?.get('item');
    if (item) {
      this.subscription.add(
        item.valueChanges.pipe(
          distinctUntilChanged((prev, curr)=>{
            return prev.label === curr.label;
          }),
          debounceTime(500),
          filter(value => (value.length >= 3 || value == '') ),
          switchMap((product: string) => {
            if (product == '') {
             return of(this.products)
            } else {
              this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(product.toLowerCase()));
              const result = this.products.filter(x =>  x.label.toLowerCase().includes(product.toLowerCase()));
              return of(result);
            }
          })
        ).subscribe(response => {
          this.searchProducts = response
        })
      );
    }
  }

  public isAddAttribute: boolean = false
  selectedValue(event: any) {
    let selectedOption = event.option.value;
    this.searchProducts = this.products.filter(x =>  x.label.toLowerCase().includes(selectedOption.toLowerCase()));
    this.isAddAttribute = this.searchProducts[0].is_serializable;
    if (this.isAddAttribute) {
      this.addAttributeField();
    }
  }
}
