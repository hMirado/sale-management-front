import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonLeftMenu } from '../../models/button-left-menu/button-left-menu.model';

@Component({
  selector: 'app-button-left-menu',
  templateUrl: './button-left-menu.component.html',
  styleUrls: ['./button-left-menu.component.scss']
})
export class ButtonLeftMenuComponent implements OnInit, OnDestroy {
  @Input() public buttonLeftMenu!: ButtonLeftMenu;
  @Input() public selectedMenu: string = '';
  private subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  click = (uuid: string) => {
    this.selectedMenu = uuid;
  }
}
