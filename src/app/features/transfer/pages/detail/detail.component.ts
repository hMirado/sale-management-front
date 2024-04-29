import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concatMap, filter, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { TransferService } from '../../services/transfer/transfer.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { userInfo } from 'src/app/shared/config/constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transfer } from '../../models/transfer/transfer.model';
import { status, tableProductHeader } from '../../config/constant';
import { Button } from 'src/app/shared/models/button/button.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Table } from 'src/app/shared/models/table/table.model';
import { Product } from 'src/app/features/catalog/models/product/product.model';
import { Line } from 'src/app/shared/models/table/body/line/line.model';
import { TableauService } from 'src/app/shared/services/table/tableau.service';
import { Serialization } from 'src/app/features/stock/models/serialization/serialization.model';
import { group } from '@angular/animations';

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
  public productTable: Table = {
    id: 'product-table',
    header: tableProductHeader,
    body: {
      bodyId: 'product-table-body',
      line: []
    },
    action: {
      isParent: false,
      isChild: false,
      delete: false,
      edit: false
    }
  };

  constructor(
    private transferService: TransferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private tableService: TableauService
  ) {
    this.addHeaderContent();
    this.getUserData();
  }

  ngOnInit(): void {
    this.getTransfer();
    this.configButton();
    this.getLineSerialisation();
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
        this.createForm(this.transferData);
        let lines: Line[] = []
        this.transferData.products.forEach((product: Product) => {
          let line = this.transferService.getValidateProductTable(product);
          lines.push(line)
        });
        this.productTable.body.line = lines;
        this.tableService.setTable(this.productTable);
      })
    );
  }

  getUserData(): void {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
  }

  createForm(data: Transfer): void {
    const validator = data.transfer_status.transfer_status_code == this.inProgress ? '' : 
    data.user_receiver.first_name + ' ' + data.user_receiver.last_name.toUpperCase();
    this.transferForm = this.formBuilder.group({
      transfer: this.transferUuid,
      shopSender: data.shop_sender.shop_name,
      shopReceiver: data.shop_receiver.shop_name,
      creator: data.user_sender.first_name + ' ' + data.user_sender.last_name.toUpperCase(),
      validator: validator,
      commentary: data.transfer_commentary,
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
        this.getTransfer();
        this.showNotification('success', `Transfert validé avec succès.`);
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

  getLineSerialisation() {
    this.subscription.add(
      this.tableService.getExpandedId().pipe(
        filter((id: string) => id != ''),
        switchMap((id: string) => {
          const groups = this.transferData.serializations.filter((serialization: Serialization) => serialization.fk_product_id == +id).map((serialization: Serialization) => serialization.group_id);
          let param = '';
          groups.forEach((group: string, i: number) => {
            param += i>0 ? `&group[]=${group}` : `group[]=${group}`;
          });
          return this.transferService.getTransferProductSerialization(param);
        })
      ).subscribe((response: ApiResponse) => {
        let lines: Line[] = []
        response.data.forEach((data: any, i: number) => {
          let serializations: any = [];
          data.forEach((serialization: Serialization) => {
            serializations.push(`${serialization.serialization_type?.label} : ${serialization.serialization_value}`);
          });
          lines.push(this.transferService.getSerializationLine(i.toString(), serializations));
        })
        this.tableService.setExpandedLineValues(lines);
      })
    )
  }
}
