import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { Login } from '../../models/login/login.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public hasError: boolean = false;
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private router: Router,
  ) {
    this.createForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.hasError = !this.loginForm.valid;
    if (!this.hasError) {
      const user  = new Login();
      user.email = this.loginForm.value.email;
      user.password = this.loginForm.value.password;

      this.authService.login(user).subscribe((response: ApiResponse) => {
        if (response.status === responseStatus.success) {
          this.getUserData(response.data);
        }
      })
    }
  }

  getUserData(token : string) {
    this.localStorageService.setLocalStorage('token', token);
    this.router.navigateByUrl('/catalog/category/');
  }
}
