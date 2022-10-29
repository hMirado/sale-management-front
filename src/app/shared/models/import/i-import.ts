import { IImportRule } from "./i-import-rule";

export interface IImport {
  label: string;
  validation: IImportRule;
  accept?: string;
}
