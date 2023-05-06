import { IHeader } from "src/app/shared/models/table/i-table";

export const tableProductHeader: IHeader[] = [
  {value: 'Libellé', align: 'left'},
  {value: 'Quantité', align: 'center'},
  {value: 'Numéro de série', align: 'left'}
]
export const tableTransferId: string = 'table-transfer';
export const tableTransferHeader: IHeader[] = [
  {value: 'Date de création', align: 'left'},
  {value: 'CODE', align: 'left'},
  {value: 'STatuT', align: 'center'},
  {value: 'Shop d\'origine', align: 'left'},
  {value: 'Shop déstinateur', align: 'left'},
]
export const status = {
  inProgress: 'IN_PROGRESS'
}