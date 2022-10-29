import { Component, Input, OnInit } from '@angular/core';
import { BreadCrumb } from '../../models/bread-crumb/bread-crumb.model';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {
  @Input() public breadCrumbs: BreadCrumb[] = [];
  @Input() public title: string = 'Title';
  constructor() { }

  ngOnInit(): void {
  }

}
