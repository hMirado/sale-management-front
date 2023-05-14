import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concatMap, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { TransferService } from '../../services/transfer/transfer.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { userInfo } from 'src/app/shared/config/constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transfer } from '../../models/transfer/transfer.model';
import { status } from '../../config/constant';
import { Button } from 'src/app/shared/models/button/button.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private transferUuid: string = '';
  public title: string = 'Détails du transfert';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public userData: any = {};
  public transferData!: Transfer
  public transferForm: FormGroup;
  public buttonValid!: Button;
  public ButtonCancel: Button;
  public inProgress: string = status.inProgress

  constructor(
    private transferService: TransferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {
    this.addHeaderContent();
    this.getUserData();
    this.getTransfer();
  }

  ngOnInit(): void {
    this.configButton();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addHeaderContent(): void {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '/transfer',
        label: 'Liste des transferts',
      },
      {
        url: '',
        label: 'Détails du transfert'
      }
    ]
  }

  getTransfer(): void {
    this.subscription.add(
      this.activatedRoute.paramMap.pipe(
        switchMap((paramMap: ParamMap) => {
          this.transferUuid = paramMap.get('uuid') as string;
          return this.transferService.getTransfer(this.transferUuid);
        })
      ).subscribe((response: ApiResponse) => {
        this.transferData = response.data;
        this.createForm();
      })
    );
  }

  getUserData(): void {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
  }

  createForm(): void {
    console.log(this.transferData);
    
    const validator = this.transferData.transfer_status.transfer_status_code == this.inProgress ? '' : 
      this.transferData.user_receiver.first_name + ' ' + this.transferData.user_receiver.last_name.toUpperCase();
    this.transferForm = this.formBuilder.group({
      transfer: this.transferUuid,
      shopSender: this.transferData.shop_sender.shop_name,
      shopReceiver: this.transferData.shop_receiver.shop_name,
      creator: this.transferData.user_sender.first_name + ' ' + this.transferData.user_sender.last_name.toUpperCase(),
      validator: validator,
      commentary: this.transferData.transfer_commentary,
    });
  }

  configButton(): void {
    this.buttonValid = {
      id: 'valid',
      label: 'Valider',
      color: 'primary',
      action: this.validateTransfer
    };
    this.ButtonCancel = {
      id: 'cancel',
      label: 'Annuler',
      color: 'secondary',
      action: this.cancelTransfer
    };
  }

  validateTransfer = () => {
    const value = {
      user: this.userData.user_uuid,
      transfer: this.transferForm.value['transfer'],
      commentary : this.transferForm.value['commentary']
    };
    this.subscription.add(
      this.transferService.validateTransfer(value).subscribe((response: ApiResponse) => {
        console.log("\nresponse", response);
        this.getTransfer();
        this.showNotification('success', `Transfert validé avec succè.`);
      })
    );
  }

  cancelTransfer = () => {
    this.router.navigateByUrl('/transfer');
  }

  showNotification(type: string, message: string): void {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }
}
