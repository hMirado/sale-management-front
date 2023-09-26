import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Confirm } from '../../models/file/import/confirm';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  public fileValid$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined)
  private confirmImportData$: Subject<Confirm> = new Subject<Confirm>();
  private confirmImport$: Subject<{id: string, status: boolean}> = new Subject<{id: string, status: boolean}>();
  private result$: Subject<any> = new Subject<any>();

  constructor(
    private api: ApiService
  ) { }

  updateFileValid(fileIsValid: any) {
    this.fileValid$ = fileIsValid;
  }

  setConfirmImportData(value: Confirm): void {
    this.confirmImportData$.next(value);
  }

  getConfirmImportData(): Observable<Confirm> {
    return this.confirmImportData$;
  }

  setConfirmImport(value: {id: string, status: boolean}): void {
    this.confirmImport$.next(value);
  }

  getConfirmImport(): Observable<{id: string, status: boolean}> {
    return this.confirmImport$;
  }

  setResult(value: any): void {
    this.result$.next(value);
  }

  getResult(): Observable<any> {
    return this.result$;
  }
}
