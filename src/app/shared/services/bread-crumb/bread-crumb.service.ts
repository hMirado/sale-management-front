import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadCrumb } from '../../models/bread-crumb/bread-crumb.model';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {
  public breadCrumbs$: BehaviorSubject<BreadCrumb[]> = new BehaviorSubject<BreadCrumb[]>([]);

  constructor() { }

  setBreadCrumbs = (breadCrumbs: BreadCrumb[]): void => {
    this.breadCrumbs$.next(breadCrumbs);
  }
}
