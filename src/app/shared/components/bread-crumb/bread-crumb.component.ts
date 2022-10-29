import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadCrumb } from '../../models/bread-crumb/bread-crumb.model';
import { BreadCrumbService } from '../../serives/bread-crumb/bread-crumb.service';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  @Input() public breadCrumbs: BreadCrumb[] = [];

  constructor(
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
