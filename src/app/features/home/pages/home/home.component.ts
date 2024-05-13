import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime, filter, switchMap } from 'rxjs';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { Button } from 'src/app/shared/models/button/button.model';
import { HomeService } from '../../services/home/home.service';
import { authorizations, userInfo } from 'src/app/shared/config/constant';
import { HelperService } from 'src/app/shared/services/helper/helper.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Router } from '@angular/router';
import { Authorization } from 'src/app/shared/models/authorization/authorization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ScaleType } from '@swimlane/ngx-charts';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public title: string = 'Tableau de bord';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  private userData: any = {};
  public sessionIsStart: boolean = false;
  public sessionId: string = 'session-id';

  public chartView: any = [1500, 500];
  public chartData: any[] = [];
  public chartLegend: boolean = true;
  public legendTitle: string = "Légende";
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = "Date (jj-mm-aaaa)";
  public yAxisLabel: string = "Chiffre d'affaire (MGA)";
  public timeline: boolean = false;
  public shops: Shop[] = [];
  public saleChartForm !: FormGroup;
  public barChartForm !: FormGroup;
  public barChartData: any [];
  public colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#dc3545', '#0030ff']
  };
  public multiShopKey: string = authorizations.shop.element.multipleAction;
  public totalSale: string = '0';
  public totalQuantity: string = '0';

  constructor(
    private homeService: HomeService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private modalService: ModalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private authorizationService: AuthorizationService
  ) { 
    this.createForm();
    this.initSessionForm();
  }

  ngOnInit(): void {
    this.getUserData();
    this.addHeaderContent();
    this.getSaleGraphData();
    this.getShops();
    this.getFormValue();
    this.getSaleBarChartData();
    this.getTotal();
  }

  ngOnDestroy(): void {
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
        label: 'Tableau de bord'
      },
    ]
  }

  getUserData() {
    const data = this.localStorageService.getLocalStorage(userInfo);
    this.userData = JSON.parse(this.helperService.decrypt(data));
    this.getAction(this.userData.role.authorizations);
  }

  getAction(_authorizations: []) {
    const isSingle = _authorizations.filter((authorization: Authorization) => authorization.authorization_key == authorizations.shop.element.singleAction)[0];
  }

  openModal(id: string) {
    this.modalService.showModal(id)
  }

  closeModal(id: string) {
    this.modalService.hideModal(id)
  }


  /*getShopIsOpen() {
    this.subscription.add(
      this.homeService.getShopByUuid(this.userData.shops[0].shop_uuid).subscribe((response: ApiResponse) => {
        const isOpen = response.data.is_opened;
        if (isOpen) this.shopIsOpenButton();
        //else this.shopIsCloseButton();
      })
    );
  }

  shopIsOpenButton() {
    this.shopIsOpen = true;
    //this.buttonOpenShop.action = this.closeShop;
    this.localStorageService.setLocalStorage('shop', this.userData.shops[0].shop_uuid);
  }

  openShop() {
    this.subscription.add(
      this.homeService.openShop(this.userData.shops[0].shop_uuid, true).subscribe((response: ApiResponse) => {
        this.shopIsOpenButton();
        this.closeModal(this.openShopId);
      })
    );
  }

  closeShop = () => {
    this.subscription.add(
      this.homeService.openShop(this.userData.shops[0].shop_uuid, false).subscribe((response: ApiResponse) => {
        this.shopIsCloseButton();
      })
    );
  }*/

  makeSale = () => {
    this.router.navigate(['sale']);
  }

  getSelectedShop(event: any) {
    this.localStorageService.setLocalStorage('shop', event.shop_uuid);
    this.closeModal(this.sessionId);
    this.router.navigate(['sale']);
  }

  /**
   * @description: START CHART FUNCTION
   */
  getSaleGraphData(): void {
    const params = {
      groupByDate: "D",
      startDate: this.getLastWeek()[1],
      endDate: this.getLastWeek()[0],
      shop: ''
    }
    this.subscription.add(
      this.homeService.getSaleGraphData(params).subscribe((response: ApiResponse) => {
        this.chartData = response.data;
      })
    );
  }

  yAxisTickFormatting (value: any) {
    return value.toLocaleString('fr-Fr');
  }

  getLastWeek(): String[] {
    const date = new Date();
    const dayNow = ('0' + date.getDate()).slice(-2)
    const monthNow = ('0' + (date.getMonth() + 1)).slice(-2)
    const now = date.getFullYear() + '-' + monthNow + '-' + dayNow;
    
    const lastWeekDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 7,
    );
    const lastDay = ('0' + lastWeekDate.getDate()).slice(-2)
    const lastMonth = ('0' + (lastWeekDate.getMonth() + 1)).slice(-2)
    const previous = date.getFullYear() + '-' + lastMonth + '-' + lastDay;

    return [now, previous];
  }

  createForm(): void {
    this.saleChartForm = this.formBuilder.group({
      startDate: this.getLastWeek()[1],
      endDate: this.getLastWeek()[0],
      shop: '',
      trigger: false
    })
    this.barChartForm = this.formBuilder.group({
      perBy: '',
      trigger: false
    })
  }

  triggerSaleChartForm(status: boolean = true): void {
    this.saleChartForm.patchValue({ trigger: status });
    this.saleChartForm.updateValueAndValidity();
  }

  triggerBarChartForm(status: boolean = true): void {
    this.barChartForm.patchValue({ trigger: status });
    this.barChartForm.updateValueAndValidity();
  }

  getFormValue(): void {
    this.subscription.add(
      this.saleChartForm.valueChanges.pipe(
        filter((value: any) => value['trigger']),
        debounceTime(500),
        switchMap((value: any) => {
          this.triggerSaleChartForm(false);
          if (new Date(value['startDate']) > new Date(value['endDate'])) {
            this.showNotification(
              "danger", 
              "La date de début doit-être inferieur à la date de fin"
            )
            return [];
          } else {
            return this.homeService.getSaleGraphData(value);
          }
        })
      ).subscribe((response: ApiResponse) => this.chartData = response.data)
    );

    this.subscription.add(
      this.barChartForm.valueChanges.pipe(
        filter((value: any) => value['trigger']),
        debounceTime(500),
        switchMap((value: any) => {
          this.triggerSaleChartForm(false);
          delete value['trigger'];
          return this.homeService.getBarChartData(value);
        })
      ).subscribe((response: ApiResponse) => this.barChartData = response.data)
    );
  }

  getShops(): void {
    this.subscription.add(
      this.homeService.getShops().subscribe((response:ApiResponse) => {
        this.shops = response.data;
      })
    );
  }

  getShopName(location: string, box: any): string {
    return location + ' ' + ((box && box != null) ? box : '');
  }
  getSaleBarChartData(): void {
    this.subscription.add(
      this.homeService.getBarChartData({}).subscribe((response: ApiResponse) => {
        this.barChartData = response.data;
      })
    );
  }

  showNotification(type: string, message: string) {
    this.notificationService.addNotification({
      type: type,
      message: message
    })
  }

  getTotal(): void {
    this.subscription.add(
      this.homeService.getTotal().subscribe((response: ApiResponse) => {
        this.totalSale = this.helperService.numberFormat(response.data['total_price']/100);
        this.totalQuantity = this.helperService.numberFormat(response.data['total_quantity']);
      })
    )
  }

  getAuthorization(key: string) {
    return this.authorizationService.getAuthorization(key)
  }

  /**
   * @description: SESSION FUNCTION
   */

  public sessionForm !: FormGroup;
  initSessionForm(): void {
    this.sessionForm = this.formBuilder.group({
      cash_float: 0,
      shop: ['', Validators.required]
    });
  }

  public userShops: Shop[] = [];
  getUserShop() {
    this.subscription.add(
      this.homeService.getUserShops(this.userData.user_uuid).subscribe((response: ApiResponse) => {
        this.userShops = response.data;
      })
    )
  }

  openModalStartSession() {
    this.getUserShop();
    this.openModal(this.sessionId)
  }

  public formError: boolean = false;
  startSession() {
    if (!this.sessionForm.valid) {
      this.formError = true;
    } else {
      this.formError = false;
      const value = this.sessionForm.value;
      this.subscription.add(
        this.homeService.startSession(value.cash_float, value.shop).subscribe((response: ApiResponse) => {
          this.sessionIsStart = true
          this.closeModal(this.sessionId);
        })
      )
    }
  }

  endSession() {
    
  }
}
