export class Header {
  headId: string;
  value: string;
  style: Style;
  sort: Sort;
  colspan?: number;
  rowspan?: number;
}

export class Sort {
  isSorted: boolean;
  icon?: string;
  direction?: 'ASC' | 'DESC';
  function?: Function;
  tooltip: Tooltip
}

export class Tooltip {
  hasTooltip: boolean;
  text?: string;
  flow?: 'top' | 'right' | 'bottom' | 'left'
}

export class Style {
  align: 'align-right' | 'align-left' | 'align-center';
}