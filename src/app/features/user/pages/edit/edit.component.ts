import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concatMap, filter, Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { Role } from 'src/app/shared/models/role/role.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public title: string = 'Détail de l\'utilisateur';
  public breadCrumbs: BreadCrumb[] = [];
  public user: User = {};
  public userFormGroup!: FormGroup;
  public roles: Role[] = [];
  public shops: Shop[] = [];
  public selectedShopId: string = '';
  public selectedRole: Role;
  public isAdmin: boolean = false;
  public isEditable: boolean = false;
  public menuInfo: string = 'info';
  public menuShopRattached: string = 'shop';
  public menuProfil: string = 'profil';
  public currentMenu: string = this.menuInfo;
  private userUuid: string = '';

  constructor(
    private activedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.addHeaderContent();
    this.createForm();
  }

  ngOnInit(): void {
    this.getUser();
    this.getRoles();
    this.roleValueChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '/user',
        label: 'Liste des utilisateurs',
      },
      {
        label: 'Détail de l\'utilisateur',
      }
    ]
  }

  createForm() {
    this.userFormGroup = this.formBuilder.group({
      user_uuid: ['', Validators.required],
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
    })
  }

  get shopField(): FormArray {
    return this.userFormGroup.get('shops') as FormArray;
  }

  addShop(id: number, name: string, isChecked: boolean, location: string) {
    const field = this.formBuilder.group({
      id: [id, Validators.required],
      isChecked: [isChecked, Validators.required],
      name: [name, Validators.required],
      location: [location, Validators.required],
    });
    this.shopField.push(field);
  }

  getUser() {
    this.subscription.add(
      this.activedRoute.paramMap.pipe(
        concatMap((params: ParamMap) => {
          this.userUuid = params.get('uuid') as string;
          return this.userService.getUserByUuid(this.userUuid);
        })
      ).subscribe((response: ApiResponse) => {
        this.user = response.status == responseStatus.success ? response.data : null; 
        if (this.user) {
          this.userFormGroup.patchValue({
            user_uuid: this.userUuid,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            phone_number: this.user.phone_number,
            fk_role_id: this.user.fk_role_id,
          });
          this.userFormGroup.updateValueAndValidity();
          this.selectedRole = this.user.role as Role;
        }
      })
    );
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


  triggerEvent(isTriggered: boolean = true) {
    this.userFormGroup.controls['trigger'].setValue(isTriggered);
    this.userFormGroup.updateValueAndValidity();
  }

  roleValueChange() {
    this.userFormGroup.get('fk_role_id')?.valueChanges.pipe(
      filter(value => value && this.isEditable /*&& this.userFormGroup.value['trigger']*/)
    ).subscribe(value => {
      this.selectedRole = this.roles.filter(role => role.role_id == value)[0];
    })
  }

  selectMenu(menu: string) {
    if (this.currentMenu != menu) this.currentMenu = menu;
    this.isEditable = false;
  }

  cancelEdit() {
    this.isEditable = false;
    this.newPassword = '';
    this.getUser();
  }

  enableEdit() {
    this.isEditable = true;
  }

  saveEdit() {
    const value = this.userFormGroup.value;
    this.subscription.add(
      this.userService.updatUser(value).subscribe((response: ApiResponse) => {
        this.showNotification('success', response.notification);
        this.isEditable = false;
      })
    );
  }

  public newPassword: string = '';
  resetPassword() {
    this.subscription.add(
      this.userService.resetPassword(this.userUuid).subscribe((response: ApiResponse) => {
        console.log(response);
        this.newPassword = response.data['newPassword'];
        this.showNotification('success', response.notification);
        this.isEditable = false;
        setTimeout(() => this.newPassword = '', 30000);
      })
    );
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
