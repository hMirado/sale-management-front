import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../models/notification/notification.model';

const notification: Notification = {message: '', type: ''}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notification$: BehaviorSubject<Notification> = new BehaviorSubject<Notification>(notification)
  public notificationIsRemoved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  addNotification(_notification: Notification) {
    this.notification$.next(_notification);
  }

  initializeNotificationIsRemoved() {
    this.notificationIsRemoved$.next(false);
  }

  updateNotificationIsRemoved(status: boolean) {
    this.notificationIsRemoved$.next(status);
  }
}
