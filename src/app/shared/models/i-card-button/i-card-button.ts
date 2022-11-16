import {IIcon} from "../i-icon/i-icon";

export interface ICardButton {
  id: string;
  icon: IIcon;
  label: string;
  action?(): void;
}
