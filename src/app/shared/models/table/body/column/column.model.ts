export class Column {
  content:
  ({
    type :'simple';
    key: string;
    value: string;
    image?: string;
    expandable: boolean;
    tooltip: Tooltip;
  } |
  {
    type :'badge';
    key: string;
    badge: Badge;
    tooltip: Tooltip;
  } |
  {
    type: 'input';
    key: string;
    input: 'number'|'text'|'checkbox'|'switch';
    disabled: boolean;
    value: string;
    tooltip: Tooltip;
  } |
  {
    type: 'button';
    key: string;
    value: string;
    action: Function;
    disabled: boolean;
    icon?: Icon;
  } | {
    type: 'icon';
    icon: string;
    key: string;
    bg: 'text-success' | 'text-danger' | 'text-warning' | 'text-default';
    tooltip: Tooltip;
  }) [];
  style: Style
}

export class Style {
  align: 'align-right' | 'align-left' | 'align-center';
  background?: string;
  flex: 'row' | 'column'
}

export class Badge {
  value: string;
  bg: 'bg-success' | 'bg-danger' | 'bg-warning' | 'bg-default';
}

export class Tooltip {
  hasTooltip: boolean;
  text?: string;
  flow?: 'top' | 'right' | 'bottom' | 'left'
}

export class Icon {
  tooltip: Tooltip;
  icon: string;
  bg: 'text-success' | 'text-danger' | 'text-warning' | 'text-default' | 'text-secondary';
}