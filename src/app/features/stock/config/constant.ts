import { IExport } from "src/app/shared/models/export/i-export";
import { IImport } from "src/app/shared/models/import/i-import";
import { IHeader } from "src/app/shared/models/table/i-table";

export const importStockConfig: IImport = {
  label: 'Importer Stock',
  validation: {
    encoding: ['utf8'],
    maxSize: 1024 * 8
  },
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export const exportStockConfig: IExport = {
  label: 'Exporter le modèle',
  fileName: 'category-model.xlsx'
}


export const tableStockId: string = 'table-stock';

export const tableStockHeader: IHeader[] = [
  {value: 'CODE ARTICLE'},
  {value: 'LABEL'},
  {value: 'QUANTITE'},
  {value: 'DATE dE CREATION'},
]