import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public title: string = 'Gestion des profils';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();

  constructor() { 
    this.addHeaderContent();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Gestion des profils',
      }
    ]
  }
}
