export class ButtonLeftMenu {
  title!: string;
  menu!: IButtonLeftMenuItem[];
}

export interface IButtonLeftMenuItem {
  uuid:string;
  key: string;
  label: string;
  url?: string
}
