export const tokenKey: string = 'token';
export const tokenFromUI: string = "abcdefghijklmnopqrstuvwxy0123456789123456";
export const userInfo: string = "pgu";
export const tableFilter ={
  tableFilterFieldType:{
    select: 'select',
    input: 'input',
    checkbox: 'checkbox',
    swicth: 'switch'
  },
  debounceTime: 500,
  key: {
    keyword: 'search',
    roles: 'roles',
    shop: 'shop',
    product_category: 'category',
    product_serialization: 'serialization',
    product_stock: 'stock'
  }
}
export const ADMIN: string = 'ADMIN';
export const SELLER: string = 'SELLER';
export const inputTimer: number = 500;

export const authorizations = {
  itemCategory: {
    page: "PAGE_ITEM_CATEGORY",
    element: {
      creare: 'PAGE_ELEMENT_CREATE_ITEM_CATEGORY',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ITEM_CATEGORY',
      delete: 'PAGE_ELEMENT_DELETE_ITEM_CATEGORY'
    }
  },
  item: {
    page: 'PAGE_ITEM',
    elemnt: {
      add: 'PAGE_ELEMENT_ADD_ITEM',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ITEM',
      delete: 'PAGE_ELEMENT_DELETE_ITEM'
    }
  },
  stock: {
    page: 'PAGE_STOCK',
    element: {
      add: 'PAGE_ELEMENT_STOCK_ADD',
      import: 'PAGE_ELEMENT_STOCK_IMPORT',
    }
  },
  transfer: {
    page: 'PAGE_TRANSFER',
    element: {
      create: 'PAGE_ELEMENT_CREATE_NEW_TRANSFER'
    }
  },
  sale: {
    page: 'PAGE_SALE'
  },
  user: {
    page: 'PAGE_USER',
    element: {
      add: 'PAGE_ELEMENT_ADD_NEW_USER',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_USER',
      reset: 'PAGE_ELEMENT_RESET_PASSWORD',
      delete: 'PAGE_ELEMENT_DELETE_USER',
    }
  },
  role: {
    page: 'PAGE_ROLE',
    element: {
      create: 'PAGE_ELEMENT_CREATE_NEW_ROLE',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ROLE',
      delete: 'PAGE_ELEMENT_DELETE_PROFIL'
    }
  },
  shop: {
    page: 'PAGE_SHOP',
    element: {
      singleAction: 'PAGE_ELEMENT_SINGLE_SHOP',
      multipleAction: "PAGE_ELEMENT_MULTIPLE_SHOP"
    }
  }
}