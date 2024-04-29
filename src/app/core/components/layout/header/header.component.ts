import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { LayoutService } from 'src/app/core/services/layout/layout.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  constructor(
    private layoutService: LayoutService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.subscription.add(
      this.layoutService.logout().subscribe(response => {
        if (response.status === responseStatus.success) {
          this.localStorageService.clearLocalStorage();
          location.href = '/authentication'
          //this.router.navigate(['authentication']);
        }
      })
    )
  }
}
