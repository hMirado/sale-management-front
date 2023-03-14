export class Row {
  tableId: string;
  id: string;
  row: RowValue[];
}

export interface RowValue {
  id: string;
  type: 'normal' | 'input' | 'button';
  expand: boolean;
  value: Value | Badge | Button;
  icon?: Icon;
}

export interface Badge {
  value: Value;
  bg?: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default';
}

export interface Icon {
  icon: string;
  color?: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default';
}

export interface Button {
  text: string;
  btnIcon?: Icon;
  size: 'btn-xs';
  bg: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default';
  action: void;
}

export interface Value {
  value: any[];
  align?: 'center' | 'left' | 'right';
}