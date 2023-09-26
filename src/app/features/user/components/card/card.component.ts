import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user/user.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() user !: User;
  constructor() { }

  ngOnInit(): void {
  }

  getMoreShop(count: number) {
    return count > 1 ? 'Affecter à plusieurs shop' : this.user.shops?.[0]?.shop_name || ''
  }
}
