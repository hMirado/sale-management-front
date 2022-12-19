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
    allMenu.forEach((menu: Menu, index: number) => {
      if (!menu.groupName && !menu.authorization && menu.subMenu && menu.subMenu.length > 0) 
        this.addMenu(authKey, menu, index)
      if (menu.groupName && menu.subMenu && menu.subMenu.length > 0)
        this.addMenu(authKey, menu, index);
      if (menu.authorization) this.menus.push(menu)
    })
  }

  private addMenu(authKey: string[], menu: Menu, i: number) {
    let newMenu = menu;
    menu?.subMenu?.forEach(subMenu => {
      if (subMenu.url === this.router.url) this.menuOpenId = i;
      
      if (!authKey.includes(subMenu.authorization as string)) {
        newMenu = newMenu.subMenu?.filter( x => x.authorization !== subMenu.authorization) as Menu;
      }
    })
    if (newMenu) this.menus.push(newMenu);
  }

  public getMenuOpened(id: number) {
    this.menuOpenId = id;
  }
}