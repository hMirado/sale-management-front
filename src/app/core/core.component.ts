import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notification } from './models/notification/notification.model';
import { NotificationService } from './services/notification/notification.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit, OnDestroy {

  private subscription = new Subscription()
  public notifications: Notification[] = [];
  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.routerEvent()
    this.notifications = [];
  }

  ngOnInit(): void {
    this.addNotification();
    this.removeNotification();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  routerEvent() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.notifications = [];
      } 

      if (e instanceof NavigationEnd) {
        this.notifications = [];
      }
    });
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

  removeNotification(){
    this.subscription.add(
      this.notificationService.notificationIsRemoved$.subscribe((status) => {
        if (status) {
          this.notifications.shift();
          this.notificationService.initializeNotificationIsRemoved()
        }
      })
    );
  }
}
