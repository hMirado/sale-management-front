import { Component, Input, OnInit } from '@angular/core';
import { Button } from '../../models/button/button.model';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() id: string;
  @Input() button: Button;
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  click(): void {
    if (this.id == this.button.id && this.button.action != null) this.button.action();
  }
}
