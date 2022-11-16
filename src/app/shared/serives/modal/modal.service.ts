import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IModal} from "../../models/i-modal/i-modal";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public modal$: BehaviorSubject<IModal | null> = new BehaviorSubject<IModal | null>(null);
  public isSaved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isCanceled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  showModal(id: string) {
    this.modal$.next({id: id, visible: true} as IModal);
  }

  hideModal(id: string) {
    this.modal$.next({id: id, visible: false} as IModal);
  }

  clickSave(save: boolean) {
    this.isSaved$.next(save)
  }

  clickCancel(cancel: boolean) {
    this.isCanceled$.next(cancel)
  }
}
