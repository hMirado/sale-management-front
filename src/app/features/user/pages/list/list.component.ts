import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, Subscription, switchMap, zip } from 'rxjs';
import { responseStatus } from 'src/app/core/config/constant';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { BreadCrumb } from 'src/app/shared/models/bread-crumb/bread-crumb.model';
import { IInfoBox } from 'src/app/shared/models/i-info-box/i-info-box';
import { ITableFilterSearchValue } from 'src/app/shared/models/i-table-filter/i-table-filter';
import { Role } from 'src/app/shared/models/role/role.model';
import { Shop } from 'src/app/shared/models/shop/shop.model';
import { ICell, IRow, ITable } from 'src/app/shared/models/table/i-table';
import { TableFilterService } from 'src/app/shared/services/table-filter/table-filter.service';
import { TableService } from 'src/app/shared/services/table/table.service';
import { tableProductHeader } from '../../config/constant';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public title: string = 'Gestion des utilisateurs';
  public breadCrumbs: BreadCrumb[] = [];
  private subscription = new Subscription();
  private role$: Observable<ApiResponse> = this.userService.getRoles().pipe(map((response: ApiResponse) => response.data )); 
  private shop$: Observable<ApiResponse> = this.userService.getAllShop().pipe(map((response: ApiResponse) => response.data ));
  private shopAndRole$: Observable<any> = zip(
    this.role$,
    this.shop$
  );
  public currentPage: number = 0;
  public lastPage: number = 0;
  public nextPage: number = 0;
  public totalPages: number = 0;
  public totalItems: number = 0;
  private params: any = {};
  public infoBox!: IInfoBox;

  constructor(
    private router: Router,
    private userService: UserService,
    private tableFilterService: TableFilterService,
    private tableService: TableService
  ) {
    this.addHeaderContent();
  }

  ngOnInit(): void {
    this.getFilterParams();
    this.getUsers();
    this.getFilterValue();
    this.countUser();
    this.getLineId()
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
        label: 'Gestion des utilisateurs',
      }
    ]
  }

  goToCreateUser() {
    this.router.navigateByUrl('/user/create');
  }

  getFilterParams() {
    this.subscription.add(
      this.shopAndRole$.subscribe((responses: any[]) => {
        const roles: Role[] = responses[0];
        const shops: Shop[] = responses[1];
        this.tableFilterService.setFilterData(this.userService.getUserFilter(roles, shops));
      })
    );
  }

  getUsers() {
    this.subscription.add(
      this.userService.getUsers().subscribe((response: ApiResponse) => this.getUsersResponse(response))
    );
  }

  getUsersResponse(response: ApiResponse) {
    let table: ITable = {
      id: 'user',
      header: tableProductHeader,
      body: null
    };
    let rows: IRow[] = []
    if (response.status == responseStatus.success) {
      let users: User[] = response.data['items'];
      users.forEach((user: User) => {
        const row: IRow = this.userService.getTableRowValue(user)
        rows.push(row);
      });
      let cells: ICell = {
        cellValue: rows,
        paginate: true,
        isEditable: true
      };
      table.body = cells;
      this.tableService.setTableValue(table);
      this.currentPage = response.data.currentPage;
      this.lastPage = this.currentPage == 1 ? 0 : this.currentPage - 1;
      this.nextPage = response.data.totalPages == this.currentPage ? this.currentPage : this.currentPage + 1;
      this.totalPages = response.data.totalPages;
      this.totalItems = response.data.totalItems;
    }
  }

  getFilterValue() {
    this.subscription.add(
      this.tableFilterService.filterFormValue$.pipe(
        filter((filter: ITableFilterSearchValue|null) => filter != null && filter?.id == 'user-filter'),
        switchMap((filter: ITableFilterSearchValue|null) => {
          this.params['page'] = 1;
          this.params = { ...this.params, ... filter?.value }
          return this.userService.getUsers(this.params)
        })
      ).subscribe((response: ApiResponse) => this.getUsersResponse(response))
    );
  }

  goToNextPage(page: number){
    this.params['page'] = page;
    this.userService.getUsers(this.params).subscribe((response: ApiResponse) => this.getUsersResponse(response));
  }

  countUser() {
    this.subscription.add(
      this.userService.countUser().subscribe((response: ApiResponse) => {
        this.infoBox = {
          id: 'user',
          bg: 'bg-info',
          icon: 'fa-users',
          number: response.data,
          text: 'Nombre d\'utilisateur'
        }
      })
    )
  }

  getLineId() {
    this.subscription.add(
      this.tableService.getlineId().subscribe((value: any) => {
        if (value && value['action'] == 'view') this.router.navigateByUrl(`/user/detail/${value['id']}`);
      })
    );
  }
}
