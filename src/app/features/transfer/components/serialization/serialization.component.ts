import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, first, last, of, pairwise, switchMap, tap } from 'rxjs';
import { TransferService } from '../../services/transfer/transfer.service';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inputTimer } from 'src/app/shared/config/constant';
import { Serialization } from 'src/app/features/stock/models/serialization/serialization.model';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';

@Component({
  selector: 'app-serialization',
  templateUrl: './serialization.component.html',
  styleUrls: ['./serialization.component.scss']
})
export class SerializationComponent implements OnInit, OnDestroy {
  @Input() shopSender!: string;
  public quantity: number = 0;
  public product!: Product;
  private subscription = new Subscription();
  public formGroup: FormGroup;

  constructor(
    private transferService: TransferService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProductDetail();
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

  getProductDetail(): void {
    this.subscription.add(
      this.transferService.getSelectedProduct().pipe(
        switchMap((product: Product) => {
          this.product = product;
          this.createForm();
          return this.transferService.getQuantity()
        })
      ).subscribe((qty: Number) => {
        this.quantity = +qty;
        this.addSerializationField(this.quantity);
      })
    );
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      productUuid: this.product.product_uuid,
      serializations: this.formBuilder.array([]),
      trigger: false
    })
  }

  serializationField(): FormArray {
    return this.formGroup.get('serializations') as FormArray;
  }

  addSerializationField(quantity: number) {
    for(let i = 0; i < quantity; i++) {
      let field = this.formBuilder.group({
        label: '',
        value: ['', Validators.required],
        group: ''
      }); 
      this.serializationField().push(field)
    }
  }

  triggerEvent() {
    this.formGroup.patchValue({trigger: true});
    this.formGroup.updateValueAndValidity();
  }

  public serializations$: Observable<Serialization[]> = of([]);
  public serializations: Serialization[] = [];
  getFormValue(i: number) {
    this.subscription.add( 
      this.serializationField().at(i).valueChanges.pipe(
        debounceTime(inputTimer),
        distinctUntilChanged(),
        filter((value: any) => value && (value.value.length == 0 || value.value.length > 3) && this.formGroup.value['trigger']),
        switchMap((value: any)  => {
          this.formGroup.patchValue({trigger: false});
          
          return this.transferService.getSerialization(this.shopSender, this.product.product_uuid, value.value)
        })
      ).subscribe((response: ApiResponse) => {
        this.serializations = [];
        console.log(this.formGroup.value.serializations);
        const groups = this.formGroup.value.serializations.map((value: any) => value.group);
        console.log(groups);
        
        
        response.data.forEach((serializations: Serialization[]) => {
          serializations.forEach((serialization: Serialization) => {
            if (!groups.includes(serialization.group_id)) this.serializations.push(serialization);
          })
        })
        
        this.serializations$ = of(this.serializations);
      })
    )
  }

  selectedValue(event: any, i: number) {
    console.log(event.option.value);
    const value = event.option.value
    const seletced = this.serializations.filter((serialization: Serialization) => serialization.serialization_value == value)[0];
    this.serializationField().at(i).patchValue(
      {
        label: seletced.label,
        value: seletced.serialization_value,
        group: seletced.group_id
      }
    );
    this.serializations$ = of([]);
  }
}
