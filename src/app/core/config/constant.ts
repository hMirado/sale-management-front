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
    icon: 'fas fa-warehouse',
    label: 'Stock',
    subMenu: [
      {
        authorization: 'PAGE_STOCK',
        label: 'Réception',
        url: '/stock'
      },
      {
        authorization: 'PAGE_STOCK',
        label: 'Transfert d\'article',
        url: '/transfer'
      }
    ]
  },
  {
    groupName: 'MON ENTREPRISE',
    subMenu: [
      {
        authorization: 'PAGE_SHOP',
        icon: 'fas fa-calendar-alt',
        label: 'Boutiques',
        url: '/setting/shop'
      },
      {
        icon: 'fas fa-users',
        label: 'UTILISATEURS',
        subMenu: [
          {
            authorization: 'PAGE_PROFIL',
            label: 'Gestion des profils',
            url: '/profil'
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