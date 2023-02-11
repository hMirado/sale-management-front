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
  {value: 'Artcile', align: 'left'},
  {value: 'CODE ARTICLE', align: 'left'},
  {value: 'STatuT', align: 'center'},
  {value: 'QUANTITE', align: 'center'},
  {value: 'Shop', align: 'left'},
  {value: 'Numéro DE série / IMEI', align: 'left'},
]

export const tableTransferId: string = 'table-transfer';

export const tableTransferHeader: IHeader[] = [
  {value: 'Date', align: 'left'},
  {value: 'ARtcile', align: 'left'},
  {value: 'CODE ARTICLE', align: 'left'},
  {value: 'QUANTITE', align: 'center'},
  {value: 'Type', align: 'center'},
  {value: 'STatuT', align: 'center'},
  {value: 'Shop d\'origine', align: 'left'},
  {value: 'Shop déstinateur', align: 'left'},
]

export const transferStatus = {
  inProgress: 'IN_PROGRESS',
  validated: 'VALIDATED',
  canceled: 'CANCELED',
}