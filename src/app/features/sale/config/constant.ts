import { Header } from 'src/app/shared/models/table/header/header.model';

export const tableSaleHeader: Header[] = [
  {
    headId: 'item',
    value: 'Article',
    style: {
      align: 'align-left',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  },
  {
    headId: 'quantity',
    value: 'Quantité',
    style: {
      align: 'align-center',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  },
  {
    headId: 'price',
    value: 'Prix',
    style: {
      align: 'align-center',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  },
  {
    headId: 'shop',
    value: 'Shop',
    style: {
      align: 'align-left',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  },
  {
    headId: 'date',
    value: 'Date',
    style: {
      align: 'align-left',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  },
  {
    headId: 'serialization',
    value: 'Numéro de série',
    style: {
      align: 'align-left',
    },
    sort: {
      isSorted: false,
      tooltip: {
        hasTooltip: false,
      },
    },
    colspan: 1,
    rowspan: 1,
  }
];
