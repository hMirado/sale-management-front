import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, filter, Subscription, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Role } from 'src/app/shared/models/role/role.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent implements OnInit, OnDestroy {
  public userFormGroup!: FormGroup;
  private subscription = new Subscription();
  public roles: Role[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { 
    this.createForm()
  }

  ngOnInit(): void {
    this.getRoles();
    this.getFormValueChange()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      fk_role_id: ['', Validators.required],
      trigger: false
    });
  }

  getRoles() {
    this.subscription.add(
      this.userService.getRoles().subscribe((response: ApiResponse) => {
        this.roles = response.data;
        this.roles.sort((a: Role, b: Role) => {
          if (a.role_name < b.role_name) return -1;
          if (a.role_name > b.role_name) return 1;
          return 0;
        });
      })
    )
  }

  triggerEvent(status: boolean = true) {
    this.userFormGroup.patchValue({trigger: status});
  }

  getFormValueChange() {
    this.subscription.add(
      this.userFormGroup.valueChanges.pipe(
        debounceTime(500),
        filter((value: any) => value['trigger'])
      ).subscribe((value: any) => {
        this.triggerEvent(false)
        if (
          (value['first_name'] && value['first_name'] != '') || (value['last_name'] && value['last_name'] != '') ||
          (value['phone_number'] && value['phone_number'] != '') || (value['fk_role_id'] && value['fk_role_id'] != '')
        ) {
          const user: User = {
            first_name: value['first_name'],
            last_name: value['last_name'],
            phone_number: value['phone_number'],
            fk_role_id: value['fk_role_id']
          }
          this.userService.nextUserInfoValue(user);
        } else {
          this.userService.nextUserInfoValue(null);
        }
      })
    );
  }
}
