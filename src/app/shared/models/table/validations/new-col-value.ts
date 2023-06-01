import { Column } from "../body/column/column.model";

export interface NewColValue {
  tableId: string, 
  line: string, 
  index: number, 
  columns: Column
}
