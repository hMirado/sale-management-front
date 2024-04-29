import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-file-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() id!: string;
  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  closeModal(id: string): void {
    this.modalService.hideModal(id);
  }
}
