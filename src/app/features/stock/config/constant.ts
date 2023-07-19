import { IExport } from "src/app/shared/models/export/i-export";
import { IImport } from "src/app/shared/models/import/i-import";
import { Column } from "src/app/shared/models/table/body/column/column.model";
import { Header } from "src/app/shared/models/table/header/header.model";
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

export const tableStockHeader: Header[] = [
    {
    headId: 'item',
    value: 'Article',
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
    headId: 'code',
    value: 'Code article',
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
    headId: 'status',
    value: 'Statut',
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
    headId: 'shop',
    value: 'Shop',
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
    headId: 'serialization',
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
  {
    headId: 'action',
    value: 'Action',
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
  }
]
export const tableTransferId: string = 'table-transfer';
export const depotShopCode = "DEP"
export const sellProductColumn: Column = {
  content: [
    {
      type: 'button',
      key: 'action',
      value: '',
      disabled: false,
      action: () => {},
      icon: {
        tooltip: {
          hasTooltip: true,
          text: 'Vendre',
          flow: 'top'
        },
        icon: 'fas fa-cash-register',
        bg: 'text-secondary'
      }
    }
  ],
  style: {
    align: 'align-center',
    flex: 'row'
  }
}
export const emptyColumn: Column = {
  content: [
    {
      type: 'simple',
      key: 'action',
      value: '',
      expandable: false,
      tooltip: { hasTooltip: false }
    }
  ],
  style: {
    align: 'align-left',
    flex: 'row'
  }
}