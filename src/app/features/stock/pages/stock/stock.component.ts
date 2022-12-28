import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IExport } from 'src/app/shared/models/export/i-export';
import { IImport } from 'src/app/shared/models/import/i-import';
import { IRow } from 'src/app/shared/models/table/i-table';
import { ExportService } from 'src/app/shared/serives/export/export.service';
import { FileService } from 'src/app/shared/serives/file/file.service';
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { ModalService } from 'src/app/shared/serives/modal/modal.service';
import { TableService } from 'src/app/shared/serives/table/table.service';
import { exportStockConfig, importStockConfig, tableStockId } from '../../config/constant';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  public title: string = 'Stock d\'article';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  
  public importConfig: IImport = importStockConfig;
  public exportConfig: IExport = exportStockConfig;
  public uniqueId: string = 'stock-id';

  public tableId: string = tableStockId
  private rows: IRow[] = [];

  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;

  constructor(
    private fileService: FileService,
    private notificationService: NotificationService,
    private exportService: ExportService,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private helperService: HelperService
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.helperService.reset();
    this.subscription.unsubscribe();
  }

  addHeaderContent() {
    this.breadCrumbs = [
      {
        url: '/',
        label: 'Accueil'
      },
      {
        url: '',
        label: 'Mes stocks d\'articles',
      }
    ]
  }
}
