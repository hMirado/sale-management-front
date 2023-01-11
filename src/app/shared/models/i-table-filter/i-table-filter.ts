export interface ITableFilter {
  id: string;
  title?: string;
  fields: ITableFilterField[];
}

export interface ITableFilterField {
  key: string;
  label: string;
  type: 'input' | 'checkBox' | 'select' | 'switch';
  placeholder?: string;
  value?: ITableFilterFieldValue[];
}

export interface ITableFilterFieldValue {
  key: string;
  label: string;
  value: string|boolean|number|null;
  default?: boolean;
}

export interface ITableFilterSearchValue {
  id: string, 
  value: any[]
}