export interface I_SidebarMenu {
  groupName?: string;
  menuItem?: I_SidebarMenu_Item[];
}

export interface I_SidebarMenu_Item {
  ability_group_key?: string
  icon?:
    'dashboard'
    | 'vente'
    | 'shop'
    | 'stock'
    | 'article'
    | 'supervision'
    | 'caisse'
    | 'dotted'
    | 'parametrage'
    | 'modules'
    | 'utilisateurs';
  label: string;
  url?: string;
  active?: boolean;
  subMenu?: I_SidebarMenu[];
  action?: I_SidebarMenu_Action[]
}

/*export interface I_SidebarMenu_Item_SubMenuGroup {
  groupName: string;
  subMenuItem: I_SidebarMenu_Item_SubMenu[];
}

export interface I_SidebarMenu_Item_SubMenu {
  ability_group_key?: string;
  label: string;
  url: string;
  active?: boolean;
  action?: I_SidebarMenu_Action[];
}*/

export interface I_SidebarMenu_Action {
  ability_group_key?: string;
  label: string;
  url: string;
}