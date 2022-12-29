import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IModal} from "../../models/i-modal/i-modal";
import {Subscription} from "rxjs";
import {ModalService} from "../../serives/modal/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit,OnDestroy {
  @Input() public id: string = '';
  @Input() public singleButton: boolean = false;
  public config!: IModal;
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.getModalConfig();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getModalConfig() {
    this.subscription.add(
      this.modalService.modal$.subscribe((config: IModal | null) => {
        if (config != null && this.id == config.id) {
          this.config = config;
        }
      })
    );
  }

  closeModal() {
    this.config.visible = false;
    this.modalService.hideModal(this.id);
    this.modalService.clickCancel(true);
  }
}
