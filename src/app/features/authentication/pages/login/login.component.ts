import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { tokenKey } from 'src/app/shared/config/constant';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { Login } from '../../models/login/login.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Notification } from '../../../../core/models/notification/notification.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loading$ = this.loaderService.loading$;
  public loginForm!: FormGroup;
  public hasError: boolean = false;
  public notifications: Notification[] = [];
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private router: Router,
    public loaderService: LoaderService,
    private notificationService: NotificationService,
  ) {
    this.createForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.addNotification()
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      emailOrPhoneNumber: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.hasError = !this.loginForm.valid;
    if (!this.hasError) {
      const loginValue  = new Login();
      loginValue.emailOrPhoneNumber = this.loginForm.value.emailOrPhoneNumber;
      loginValue.password = this.loginForm.value.password;

      this.authService.login(loginValue).subscribe((response: ApiResponse) => {
        if (response.status === responseStatus.success) {
          this.getUserData(response.data);
        }
      })
    }
  }

  getUserData(data: any) {
    const cryted = this.helperService.encrypt(JSON.stringify(data['user']));
    this.localStorageService.setLocalStorage(tokenKey, data['token']);
    this.localStorageService.setLocalStorage('pgu', cryted);
    this.router.navigateByUrl('/');
  }


  addNotification() {
    this.subscription.add(
      this.notificationService.notification$.subscribe((notification) => {
        if (notification.message && notification.type != '') {
          this.notifications.push(notification)
        }
      })
    );
  }
}
