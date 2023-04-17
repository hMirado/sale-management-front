import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input('title') title!: string;
  @Input('id') id!: string;
  @Input() active: boolean = false;
}
