import { IExport } from "src/app/shared/models/export/i-export";
import { IImport } from "src/app/shared/models/import/i-import";

export const impportCategoryConfig: IImport = {
  label: 'Importer catégorie',
  validation: {
    encoding: ['utf8'],
    maxSize: 1024 * 8
  },
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export const exportCategoryConfig: IExport = {
  label: 'Exporter le modèle',
  fileName: 'category-model.xlsx'
}