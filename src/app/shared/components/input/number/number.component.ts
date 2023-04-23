import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, filter, switchMap } from 'rxjs';
import { inputTimer } from 'src/app/shared/config/constant';

@Component({
  selector: 'app-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() value: string = '';
  @Output() formValue = new EventEmitter<any>();
  public numberFormGroup!: FormGroup;
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.numberFormGroup  =this.formBuilder.group({
      trigger: false
    });
  }

  ngOnInit(): void {
    this.addControl();
    this.formValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addControl(): void {
    this.numberFormGroup.addControl('id', new FormControl(this.id));
    this.numberFormGroup.addControl('value', new FormControl(this.value, [Validators.required, Validators.pattern(/^\d*[1-9]\d*$/)]));
  }

  triggerEvent() {
    this.numberFormGroup.patchValue({trigger: true});
    this.numberFormGroup.updateValueAndValidity();
  }

  formValueChange() {
    this.subscription.add(
      this.numberFormGroup.valueChanges.pipe(
        debounceTime(inputTimer + inputTimer),
        filter((value: any) => value['trigger'])
      ).subscribe((value: any) => {
        value = {...value, ...{isValid: this.numberFormGroup.valid}};
        this.formValue.emit(value);
      })
    );
  }
}
