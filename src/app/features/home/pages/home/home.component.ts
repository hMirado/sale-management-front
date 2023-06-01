import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { Button } from 'src/app/shared/models/button/button.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public title: string = 'Tableau de bord';
  public breadCrumbs: BreadCrumb[] = [];
  public buttonMakeSale: Button;
  public buttonOpenShop: Button;
  constructor() { }

  ngOnInit(): void {
    this.addHeaderContent();
    this.configButton();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '',
        label: 'Tableau de bord'
      },
    ]
  }

  configButton() {
    this.buttonOpenShop = {
      id: 'open',
      label: 'Ouvrir shop',
      color: 'primary',
      action: this.openShop
    };
    this.buttonMakeSale ={
      id: 'sale',
      label: 'Faire une vente',
      color: 'secondary'
    }
  }

  public shopIsOpen: boolean = false;
  openShop = () => {
    this.shopIsOpen = true;
  }
}
