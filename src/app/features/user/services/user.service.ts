import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfoValue: Subject<User | null> = new Subject<User | null>()
  private userCreated: Subject<User> = new Subject<User>();
  private userShop: Subject<any | null> = new Subject<any | null>();
  constructor(
    private apiService: ApiService
  ) { }

  getRoles(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/role`;
    return this.apiService.doGet(url);
  }

  getShopByStatus(): Observable<ApiResponse> {
    let url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url, {status: true});
  }

  nextUserInfoValue(value: User | null): void {
    this.userInfoValue.next(value);
  }

  getUserValue(): Observable<User | null> {
    return this.userInfoValue;
  }

  createUser(user: User): Observable<ApiResponse> {
    let url = `${environment['store-service']}/user`;
    return this.apiService.doPost(url, user);
  }

  getAllShop(): Observable<ApiResponse> {
    const param = { status: true };
    const url = `${environment['store-service']}/shop`;
    return this.apiService.doGet(url, param);
  }

  nextUserCreated(userCreated: User): void {
    this.userCreated.next(userCreated);
  }

  getUserCreated(): Observable<User> {
    return this.userCreated;
  }

  nextUserShop(value: any | null): void {
    this.userShop.next(value)
  }

  getUserShop(): Observable<any | null> {
    return  this.userShop;
  }
}
