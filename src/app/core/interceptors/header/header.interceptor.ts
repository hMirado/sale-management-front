import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { tokenKey } from 'src/app/shared/config/constant';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    private helperService: HelperService,
    private localStorageService: LocalStorageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getLocalStorage(tokenKey)
    const headers = new HttpHeaders({
      "Accept": "Application/json",
      "Authorization": "Bearer " + token,
    })
    const httpRequest = request.clone({headers})
    return next.handle(httpRequest);
  }
}
