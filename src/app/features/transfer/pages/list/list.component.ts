import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { TransferService } from '../../services/transfer/transfer.service';
import { userInfo, ADMIN } from 'src/app/shared/config/constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { tableTransferHeader, tableTransferId } from '../../config/constant';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { Transfer } from '../../models/transfer/transfer.model';
import { TableService } from 'src/app/shared/services/table/table.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public title: string = 'Gestion des transfert d\'articles';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  private userData: any = {};
  public tableId: string = tableTransferId;
  private currentShop: string = '';
  private currentUser: string = '';
  private rows: IRow[] = [];
  private transfers: Transfer[] = [];

  constructor(
    private router: Router,
    private transferService: TransferService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private tableService: TableService,
  ) {
    this.addHeaderContent();
    this.getUserData();
  }

  ngOnInit(): void {
    this.getTransfers();
    this.getTableAction();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  addHeaderContent(): void {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Transfert d\'article'
      }
    ]
  }

  getUserData(): void {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data))

    this.currentShop = ''
    if (this.userData.role.role_key != ADMIN) {
      this.currentShop = this.userData.shops[0].shop_uuid;
      this.currentUser = this.userData.user_uuid
    }
  }

  gotToCreateTransfer(): void {
    this.router.navigateByUrl('/transfer/create');
  }

  getTransfers(): void {
    this.subscription.add(
      this.transferService.getTransfers(this.currentShop, this.currentUser).subscribe((response: ApiResponse) => {
        this.getTransfersResponse(response);
      })
    );
  }

  getTransfersResponse(response: ApiResponse) {
    this.rows = [];
    this.transfers = response.data.items;
    this.transfers.forEach((transfer: Transfer) => {
      const row = this.transferService.getTransferTableRowValue(transfer);
      this.rows.push(row);
    });
    const cell: ICell = {
      cellValue: this.rows,
      paginate: true,
      isViewable: true
    };
    const table: ITable = {
      id: this.tableId,
      header: tableTransferHeader,
      body: cell
    }
    this.tableService.setTableValue(table);
  }

  getTableAction() {
    this.subscription.add(
      this.tableService.getlineId().subscribe((value: {id: string, action: string}) => {
        if (value && value.id != '' && value.action == 'view') {
          this.router.navigateByUrl(`/transfer/${value.id}`);
        }
      })
    );
  }
}
