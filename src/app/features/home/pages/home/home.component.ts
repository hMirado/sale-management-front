import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public title: string = 'Tableau de bord';
  public breadCrumbs: BreadCrumb[] = [];

  constructor() { }

  ngOnInit(): void {
    this.addHeaderContent
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Tableau de bord'
      },
    ]
  }
}
