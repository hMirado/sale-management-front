import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { ImportService } from 'src/app/shared/services/import/import.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  public result: any = null;
  private subscription = new Subscription();
  constructor(
    private importService: ImportService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.getResult();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getResult(): void {
    this.subscription.add(
      this.importService.getResult().pipe(
        filter(value => value.id == this.id)
      ).subscribe(value => {
        this.modalService.showModal('import-result');
        this.result = value;
      })
    )
  }

  downloadFile(file: string, fileName: string): void {
    const byteCharacters = window.atob(file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], { type: 'xlsx/xls' });

    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + '.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  closeModal(id: string): void {
    this.modalService.hideModal(id);
  }
}
