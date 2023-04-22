export interface ITable {
  id: string;
  header: IHeader[];
  body: ICell|null;
}

export interface IHeader {
  value: string;
  collspan?: number;
  rowspan?: number;
  align?: 'center' | 'left' | 'right';
}

export interface ICell {
  cellValue: IRow [];
  isEditable?: boolean;
  isDeleteable?: boolean;
  isSwitchable?: boolean;
  isViewable?: boolean
}

export interface IRow {
  id: string;
  isExpandable: boolean;
  rowValue: IRowValue[];
}

export interface IRowValue {
  id: string;
  key: string;
  expand: boolean;
  value: IValue[];
  image?: string;
}

export interface IValue {
  type: 'simple' | 'button' | 'input-text' | 'input-number' | 'input-checkbox';
  value: string;
  align?: 'center' | 'left' | 'right';
  badge?: IBadge;
  icon?: IIcon;
  button?: IButton;
}

export interface IBadge {
  status?: boolean
  bg?: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default';
}

export interface IIcon {
  status: boolean;
  icon: string;
  color: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default';
}

export interface IButton {
  size: 'btn-xs' | 'btn-sm';
  bg: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'dark';
  action: Function;
}