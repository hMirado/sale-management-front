export interface ITable {
  id: string;
  header: IHeader[];
  body: ICell|null;
}

export interface IHeader {
  value: string;
  collspan?: number;
  rowspan?: number;
}

export interface ICell {
  cellValue: IRow [];
  isEditable: boolean;
  isDeleteable: boolean;
  isSwitchable: boolean;
}

export interface IRow {
  id: string;
  isExpandable: boolean;
  rowValue: IRowValue[];
}

export interface IRowValue {
  id: string;
  key: string;
  type: 'simple' | 'input';
  expand: boolean;
  value: number | boolean | string;
  image?: string;
}
