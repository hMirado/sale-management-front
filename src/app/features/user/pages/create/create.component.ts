import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
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
  public userFormGroup: any;
  public shopFormGroup: any;
  public isValidUserInfo: boolean = false;

  constructor(
    private userService: UserService
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
    this.getUserInfoValue();
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
        console.log(value);
        
        if ( value &&
          value['first_name'] && value['first_name'] != '' && value['last_name'] && value['last_name'] != '' &&
          value['phone_number'] && value['phone_number'] != '' && value['fk_role_id']
        ) {
          this.saveUserInfo(value);
        } else {
          this.isValidUserInfo = false;
        }
      })
    );
  }

  saveUserInfo(user: User) {
    this.subscription.add(
      this.userService.createUser(user).subscribe((response: ApiResponse) => {
        console.log(response);
        this.isValidUserInfo = true;
        this.userService.nextUserCreated(response.data)
      })
    );
  }
}
