import {Component, Input, OnInit} from '@angular/core';
import {ICardButton} from "../../models/i-card-button/i-card-button";

@Component({
  selector: 'app-card-button',
  templateUrl: './card-button.component.html',
  styleUrls: ['./card-button.component.scss']
})
export class CardButtonComponent implements OnInit {
  @Input() public config!: ICardButton;
  @Input() public id: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  click = () => {
    if (this.config.action) this.config.action();
  }
}
