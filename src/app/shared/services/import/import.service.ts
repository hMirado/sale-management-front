import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  public fileValid$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined)
  constructor(
    private api: ApiService
  ) { }

  updateFileValid(fileIsValid: any) {
    this.fileValid$ = fileIsValid;
  }
}
