import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  public title: string = 'Création d\'un nouveau utilisateur';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public userValue: User;
  public shopFormGroup: any;
  public isValidUserInfo: boolean = false;
  public isValidUserShop: boolean = false;
  @ViewChild('stepper') stepper: any;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
    this.getUserInfoValue();
    this.getUserShop();
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

  getUserInfoValue() {
    this.subscription.add(
      this.userService.getUserValue().subscribe((value: User | null) => {
        if ( value &&
          value['first_name'] && value['first_name'] != '' && value['last_name'] && value['last_name'] != '' &&
          value['phone_number'] && value['phone_number'] != '' && value['fk_role_id']
        ) {
          this.userValue = value;
          this.isValidUserInfo = true;
        } else {
          this.isValidUserInfo = false;
        }
      })
    );
  }

  createUser() {
    this.subscription.add(
      this.userService.createUser(this.userValue).subscribe((response: ApiResponse) => {
        this.userService.nextUserCreated(response.data);
        this.stepperHandler(1);
      })
    );
  }

  stepperHandler(index: any){
    this.stepper.selectedIndex = index;
  }

  private userShop: any
  getUserShop() {
    this.subscription.add(
      this.userService.getUserShop().subscribe((value: any) => {
        this.isValidUserShop = value['user'] && value['shops'].length > 0;
        this.userShop = value;
      })
    );
  }

  addUserShop() {
    this.subscription.add(
      this.userService.addUserShop(this.userShop).subscribe((response: ApiResponse) => {
        this.showNotification('success', 'Utilisateur créé et affecté à un shop');
        setTimeout(()=> this.router.navigateByUrl('user'), 1000);
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
