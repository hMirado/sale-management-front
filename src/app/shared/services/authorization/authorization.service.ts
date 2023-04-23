import { Injectable } from '@angular/core';
import { tokenKey, userInfo } from '../../config/constant';
import { HelperService } from '../helper/helper.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
  ) { }

  getAuthorization(key: string) {
    const data = this.localStorageService.getLocalStorage(userInfo);
    const user = JSON.parse(this.helperService.decrypt(data));
    const authorizations = user.role.authorizations.map((authorization: any) => authorization.authorization_key);
    return authorizations.includes(key);
  }
}
