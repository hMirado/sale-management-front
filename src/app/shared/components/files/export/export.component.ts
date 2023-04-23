import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExport } from 'src/app/shared/models/export/i-export';
import { ExportService } from 'src/app/shared/services/export/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {
  @Input() public config!: IExport;
  @Input() public id: string = '';

  private subscription = new Subscription();
  constructor(
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  export() {
    this.exportService.setIsExportValue(true);
  }
}
