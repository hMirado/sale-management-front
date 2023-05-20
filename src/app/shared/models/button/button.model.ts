export class Button {
  id: string;
  icon?: string;
  label: string;
  color: 'danger' | 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  action?(): void;
}
