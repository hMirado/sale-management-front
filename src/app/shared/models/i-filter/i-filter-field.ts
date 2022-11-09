import { IFilterFieldValue } from "./i-filter-field-value";

export interface IFilterField {
  key: string;
  label: string;
  type: 'input' | 'checkbox' | 'select';
  value?: IFilterFieldValue[];
}
