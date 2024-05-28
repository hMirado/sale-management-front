import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { Confirm } from 'src/app/shared/models/file/import/confirm';
import { FileService } from 'src/app/shared/services/file/file.service';
import { ImportService } from 'src/app/shared/services/import/import.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  public data: Confirm | null = null;
  private subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private importService: ImportService
  ) { }

  ngOnInit(): void {
    this.getConfirmData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getConfirmData(): void {
    this.subscription.add(
      this.importService.getConfirmImportData().pipe(
        filter((data: Confirm) => data.id == this.id)
      ).subscribe((data: Confirm) => {
        this.modalService.showModal(data.id)
        this.data = data
      })
    )
  }

  confirmImport(id: string): void {
    this.importService.setConfirmImport({id: id, status: true});
  }
}
