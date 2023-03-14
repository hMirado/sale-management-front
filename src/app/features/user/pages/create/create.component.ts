import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  public title: string = 'Création d\'un nouveau utilisateur';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public userFormGroup: any;
  public shopFormGroup!: FormGroup;
  public isValidUSer: boolean = false;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/user',
        label: 'Gestion des utilisateurs',
      },
      {
        label: 'Création',
      }
    ]
  }

  createForm() {
    this.userFormGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      phone_number: [
        '', 
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      ],
      password: ['', Validators.minLength(8)]
    });
    this.shopFormGroup = this.formBuilder.group({
      user: [
        '', 
        [
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ]
      ],
      shops: this.formBuilder.array([])
    });
  }
}
