import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @Input() id: string;
  public importFormGroup!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.importFormGroup = this.formBuilder.group({
      file: ['', Validators.required]
    })
  }

  onFileChange(event: any): void {
    console.log(event);
    
  }
}
