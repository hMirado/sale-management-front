import { Body } from "./body/body.model";
import { Header } from "./header/header.model";

export class Table {
  id: string;
  header: Header[];
  body: Body;
  action: {
    delete: boolean;
    edit: boolean;
  }
}
