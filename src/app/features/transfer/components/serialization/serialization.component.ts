import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, first, last, of, pairwise, switchMap, tap } from 'rxjs';
import { TransferService } from '../../services/transfer/transfer.service';
import { Product as TransfertProduct } from '../../models/validations/product'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inputTimer } from 'src/app/shared/config/constant';
import { Serialization as TransferSerialization } from "../../models/validations/serialization";
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Serialization } from 'src/app/features/stock/models/serialization/serialization.model';

@Component({
  selector: 'app-serialization',
  templateUrl: './serialization.component.html',
  styleUrls: ['./serialization.component.scss']
})
export class SerializationComponent implements OnInit, OnDestroy {
  @Input() shopSender!: string;
  public quantity: number = 0;
  public product!: TransfertProduct;
  private subscription = new Subscription();
  public formGroup: FormGroup;

  constructor(
    private transferService: TransferService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProductDetail();
    this.saveSerialisation();
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

  getProductDetail(): void {
    this.subscription.add(
      this.transferService.getSelectedProduct().subscribe((product: TransfertProduct) => {
        this.product = product;
        this.quantity = product.quantity;
        this.createForm();
        this.addSerializationField(this.quantity);
      })
    );
  }

  createForm(): void {
    this.formGroup = this.formBuilder.group({
      product_uuid: this.product.product_uuid,
      serializations: this.formBuilder.array([]),
      trigger: false
    })
  }

  serializationField(): FormArray {
    return this.formGroup.get('serializations') as FormArray;
  }

  addSerializationField(quantity: number) {
    for(let i = 0; i < quantity; i++) {
      let serialization: TransferSerialization;
      if (this.product.serializations && this.product.serializations.length > 0) {
        serialization = this.product.serializations[0];
        let field = this.formBuilder.group({
          label: [serialization.label, Validators.required],
          value: [serialization.value, Validators.required],
          group_id: [serialization.group_id, Validators.required]
        }); 
        this.serializationField().push(field)
      } else {
        let field = this.formBuilder.group({
          label: '',
          value: ['', Validators.required],
          group_id: ''
        }); 
        this.serializationField().push(field)
      }
      
    }
  }

  triggerEvent() {
    this.formGroup.patchValue({trigger: true});
    this.formGroup.updateValueAndValidity();
  }

  public serializations$: Observable<Serialization[]> = of([]);
  public serializations: Serialization[] = [];
  getFormValue(i: number): void {
    this.subscription.add( 
      this.serializationField().at(i).valueChanges.pipe(
        debounceTime(inputTimer),
        distinctUntilChanged(),
        filter((value: any) => value && (value.value.length == 0 || value.value.length > 3) && this.formGroup.value['trigger']),
        switchMap((value: any)  => {
          this.formGroup.patchValue({trigger: false});
          this.serializationField().at(i).patchValue({isValid: false});
          return this.transferService.getSerialization(this.shopSender, this.product.product_uuid, value.value)
        })
      ).subscribe((response: ApiResponse) => {
        this.serializations = [];
        const groups = this.formGroup.value.serializations.map((value: any) => value.group);
        response.data.forEach((serializations: Serialization[]) => {
          serializations.forEach((serialization: Serialization) => {
            if (!groups.includes(serialization.group_id)) this.serializations.push(serialization);
          })
        })
        
        this.serializations$ = of(this.serializations);
      })
    )
  }

  selectedValue(event: any, i: number): void {
    const value = event.option.value
    const seletced = this.serializations.filter((serialization: Serialization) => serialization.serialization_value == value)[0];
    this.serializationField().at(i).patchValue(
      {
        label: seletced.label,
        value: seletced.serialization_value,
        group_id: seletced.group_id
      }
    );
    this.serializations$ = of([]);
  }

  saveSerialisation(): void {
    this.subscription.add(
      this.transferService.getSaveSerialization().subscribe((status: boolean) => {
        const productSerialization = { ...this.formGroup.value, ...{
          quantity: this.product.quantity,
          is_serializable: this.product.is_serializable
        }}
        this.transferService.setProductSerialization(productSerialization);
      })
    );
  }
}
