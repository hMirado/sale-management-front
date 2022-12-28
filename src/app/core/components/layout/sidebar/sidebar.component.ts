import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/serives/local-storage/local-storage.service';
import { tokenKey } from 'src/app/shared/config/constant'
import { HelperService } from 'src/app/shared/serives/helper/helper.service';
import { IAuthorization } from 'src/app/shared/models/i-authorization/i-authorization';
import { Menu } from 'src/app/core/models/menu/menu.model';
import { appMenu } from 'src/app/core/config/constant'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menus: Menu[] = [];
  public menuId: number = 0;
  public menuOpenId: number;
  public subMenuOpenId: number;
  constructor(
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData() {
    const token = this.localStorageService.getLocalStorage(tokenKey);
    const decodedToken = this.helperService.decodeJwtToken(token);
    const userAuthorizations = decodedToken.user.role.authorizations;
    const authKey = userAuthorizations.map((auth: IAuthorization) => auth.authorization_key);
    this.getUserMenu(authKey)
  }

  getUserMenu(authKey: string[]) {
    const allMenu = appMenu;
    allMenu.forEach((menu: Menu, i: number) => {
      if (!menu.groupName && !menu.authorization && menu.subMenu && menu.subMenu.length > 0) {
        this.addMenu(authKey, menu, i);
      }
      if (menu.groupName && menu.subMenu && menu.subMenu.length > 0) {
        const hasGroupName = menu.groupName ? true : false;
        this.addMenu(authKey, menu, i,hasGroupName);
      }
      if (menu.authorization) this.menus.push(menu)
    })
  }

  private addMenu(authKey: string[], menu: Menu, i: number, hasGroupName: boolean = false) {
    let newMenu = menu;
    menu?.subMenu?.forEach((subMenu) => {
      const route = this.router.url;
      if (subMenu.authorization) {
        if (
          ( subMenu.url === route || subMenu.url === route.substring(0, this.router.url.indexOf('?')) )
          && !hasGroupName
        ) {
          this.menuOpenId = i+1;
          this.subMenuOpenId = 0;
        }
        newMenu.subMenu = newMenu.subMenu?.filter(x => authKey.includes(x.authorization as string));
      }
      if (subMenu.subMenu && subMenu.subMenu.length > 0) {
        subMenu.subMenu = subMenu.subMenu.filter(x =>{
          if (x.url === route || x.url === route.substring(0, this.router.url.indexOf('?'))) {
            this.menuOpenId = 0;
            this.subMenuOpenId = i+1;
          }
          return authKey.includes(x.authorization as string)
        });
        newMenu.subMenu?.push(subMenu)
      }
    })
    if (newMenu) this.menus.push(newMenu);
  }

  public getMenuOpened(i: number = 0, j: number = 0){
    this.menuOpenId = i;
    this.subMenuOpenId = j;
  }
}