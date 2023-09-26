import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IImport } from 'src/app/shared/models/import/i-import';
import { FileService } from 'src/app/shared/services/file/file.service';
import { ImportService } from 'src/app/shared/services/import/import.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {
  @Input() public config!: IImport;
  @Input() public id!: string;
  public importFormGroup!: FormGroup;
  private subscription: Subscription =new Subscription();
  
  constructor(
    private formBuilder: FormBuilder,
    private importService: ImportService,
    private fileService: FileService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  createForm() {
    this.importFormGroup = this.formBuilder.group({
      file: ['', Validators.required]
    })
  }

  resetForm(event:any) {
    event.target.value = '';
    this.importFormGroup.reset();
  }

  onFileChange(event: any) {
    this.fileService.convertFileToBase64(event.target.files[0], this.id);
    this.resetForm(event)
  }
}
