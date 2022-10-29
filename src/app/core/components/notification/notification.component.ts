import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() public type!: string;
  @Input() public message!: string;

  public fadeOut: string = '';
  constructor(
    private host: ElementRef<HTMLElement>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.closeNotification();
  }

  closeNotification(): void {
    setTimeout(() => {
      this.fadeOut = 'fadeOut';
    }, 8000)
    setTimeout(() => {
      this.host.nativeElement.remove();
      this.notificationService.updateNotificationIsRemoved(true);
    }, 10000)
  }
}
