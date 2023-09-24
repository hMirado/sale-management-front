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
  label: 'Exporter modèle',
  id: 'category-export'
}

export const tableCategoryId: string = 'table-category'

export const tableCategoryHeader: IHeader[] = [
  {value: 'CATEGORIES', align: 'left'},
  {value: 'CODE', align: 'left'},
  //{value: 'ARTICLES', align: 'center'}
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
  id: 'product-export'
}

export const tableProductId: string = 'table-product'

export const tableProductHeader: IHeader[] = [
  {value: 'CODE', align: 'left'},
  {value: 'LIBELLé', align: 'left'},
  {value: 'CATEGORIE', align: 'left'},
  {value: 'SHOP', align: 'left'},
  {value: 'PRIX (MGA)', align: 'left'},
]
//end of product
