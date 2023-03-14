import { Menu } from "../models/menu/menu.model"

export const responseStatus = {
  success: 200,
  created: 201,
  badRequest: 400,
  error: 500
}

export const authorizations = {
  itemCategory: {
    page: "PAGE_ITEM_CATEGORY",
    element: {
      import: 'PAGE_ELEMENT_IMPORT_ITEM_CATEGORY',
      creare: 'PAGE_ELEMENT_CREATE_ITEM_CATEGORY',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ITEM_CATEGORY',
      disable: 'PAGE_ELEMENT_DISABLE_ITEM_CATEGORY'
    }
  },
  item: {
    page: 'PAGE_ITEM',
    elemnt: {
      import: 'PAGE_ELEMENT_IMPORT_ITEM',
      add: 'PAGE_ELEMENT_ADD_ITEM',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ITEM',
      disable: 'PAGE_ELEMENT_DISABLE_ITEM'
    }
  },
  stock: {
    page: 'PAGE_STOCK',
    element: {
      add: 'PAGE_ELEMENT_STOCK_ADD',
      import: 'PAGE_ELEMENT_STOCK_IMPORT',
      transfer: 'PAGE_ELEMENT_STOCK_TRANSFER'
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
      disable: 'PAGE_ELEMENT_DISABLE_USER',
      userRole: 'PAGE_ELEMENT_EDIT_USER_ROLE'
    }
  },
  role: {
    page: 'PAGE_ROLE',
    element: {
      create: 'PAGE_ELEMENT_CREATE_NEW_ROLE',
      edit: 'PAGE_ELEMENT_EDIT_VIEW_ROLE',
      disable: 'PAGE_ELEMENT_DISABLE_ROLE'
    }
  }
}

export const appMenu: Menu[] = [
  {
    icon: 'fas fa-desktop',
    label: 'CATALOGUES',
    subMenu: [
      {
        authorization: 'PAGE_ITEM_CATEGORY',
        label: 'Catégories',
        url: '/catalog/category'
      },
      {
        authorization: 'PAGE_ITEM',
        label: 'Articles',
        url: '/catalog/product'
      },
    ]
  }, 
  {
    authorization: 'PAGE_STOCK',
    icon: 'fas fa-warehouse',
    label: 'Stock',
    url: '/stock'
  },
  {
    groupName: 'MON ENTREPRISE',
    subMenu: [
      {
        authorization: 'PAGE_ITEM',
        icon: 'fas fa-calendar-alt',
        label: 'Boutiques',
        url: '/setting/shop'
      },
      {
        icon: 'fas fa-users',
        label: 'UTILISATEURS',
        subMenu: [
          {
            authorization: 'PAGE_STOCK',
            label: 'Gestion des profils',
            url: '/test'
          },
          {
            authorization: 'PAGE_USER',
            label: 'Gestion des utilisateurs',
            url: '/user'
          },
        ]
      }
    ]
  }
]