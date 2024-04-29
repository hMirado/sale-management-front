import { Component, Input, OnInit } from '@angular/core';
import { SmallBox } from '../../models/small-box/small-box';

@Component({
  selector: 'app-small-box',
  templateUrl: './small-box.component.html',
  styleUrls: ['./small-box.component.scss']
})
export class SmallBoxComponent implements OnInit {
  @Input() data!: SmallBox
  constructor() { }

  ngOnInit(): void {
  }

}
