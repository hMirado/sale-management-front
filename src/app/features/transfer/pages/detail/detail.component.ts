import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { TransferService } from '../../services/transfer/transfer.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { userInfo } from 'src/app/shared/config/constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private transferUuid: string = '';
  public title: string = 'Détail du transfert';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  public userData: any = {};
  public informationForm: FormGroup;

  constructor(
    private transferService: TransferService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
  ) {
    this.addHeaderContent();
    this.getTransfer();
  }

  ngOnInit(): void {
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
        label: 'Détails'
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
        console.log(response.data);
        this.createForm();
      })
    );
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
  }

  createForm(): void {
    this.informationForm = this.formBuilder.group({
      transfer: this.transferUuid,
      userSender: ['', Validators.required],
      shopSender: ['', Validators.required],
      userReceiver: ['', Validators.required],
      shopReceiver: ['', Validators.required],
    });
  }
}
