import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public title: string = 'Gestion des utilisateurs';
  public breadCrumbs: BreadCrumb[] = [];

  constructor(
    private router: Router
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Gestion des utilisateurs',
      }
    ]
  }

  goToCreateUser() {
    this.router.navigateByUrl('/user/create');
  }
}
