import { Header } from "src/app/shared/models/table/header/header.model";
import { IHeader } from "src/app/shared/models/table/i-table";

export const tableProductHeader: Header[] = [
  {
    headId: 'name',
    value: 'Libellé',
    style: {
      align: "align-left"
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false
      }
    },
    colspan: 1,
    rowspan: 1
  },
  {
    headId: 'quantity',
    value: 'Quantité',
    style: {
      align: "align-center"
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false
      }
    },
    colspan: 1,
    rowspan: 1
  },
  {
    headId: 'sn',
    value: 'Numéro de série',
    style: {
      align: "align-left"
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false
      }
    },
    colspan: 1,
    rowspan: 1
  },
];
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