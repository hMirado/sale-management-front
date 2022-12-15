import { Component, Input, OnInit } from '@angular/core';
import { IInfoBox } from '../../models/i-info-box/i-info-box';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  @Input() public data!: IInfoBox
  constructor() { }

  ngOnInit(): void {
  }

}
