import { IExport } from "src/app/shared/models/export/i-export";
import { IImport } from "src/app/shared/models/import/i-import";
import { IHeader } from "src/app/shared/models/table/i-table";

// start of category
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

export const tableCategoryId: string = 'table-category'

export const tableCategoryHeader: IHeader[] = [
  {value: 'CATEGORIES'},
  {value: 'CODE'},
  {value: 'ARTICLES'}
]
// end of category

// start of product
export const impportProductConfig: IImport = {
  label: 'Importer article',
  validation: {
    encoding: ['utf8'],
    maxSize: 1024 * 8
  },
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export const exportProductConfig: IExport = {
  label: 'Exporter modèle',
  fileName: 'product-model.xlsx'
}

export const tableProductId: string = 'table-product'

export const tableProductHeader: IHeader[] = [
  {value: 'ARTICLE'},
  {value: 'CODE'},
  {value: 'CATEGORIE'},
  {value: 'PRIX'},
]
//end of product
