import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../../services/notification/notification.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (error: any) => {
          switch (error.status) {
            case 401:
              this.notificationService.updateNotificationIsRemoved(true);
              this.showNotification(
                "warning", 
                `Votre session est expirée. Vous allez être rediriger vers la page d'authentification.`
              );
              this.localStorageService.clearLocalStorage();
              setTimeout( () => {
                this.authentificationRequired();
              }, 10000)
              break;
            case 403:
              this.notificationService.updateNotificationIsRemoved(true);
              this.showNotification(
                "warning", 
                `Votre session est expirée. Vous allez être rediriger vers la page d'authentification.`
              );
              break;
            case 400:
              this.notificationService.updateNotificationIsRemoved(true);
              this.showNotification(
                "danger", 
                error.error.notification
              );
              break;
            default:
              console.error(['ERROR', request.url]);
              this.showNotification(
                "danger", 
                `Problème de connexion avec le serveur. Veuillez contacter le responsable si l'erreur persiste.`
              )
              break;
          }
        }
      )
    );
  }

  authentificationRequired() {
    this.router.navigate(['/authentication'])
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
