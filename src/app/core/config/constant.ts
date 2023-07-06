import { Menu } from "../models/menu/menu.model"

export const responseStatus = {
  success: 200,
  created: 201,
  badRequest: 400,
  error: 500
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
          // {
          //   authorization: 'PAGE_PROFIL',
          //   label: 'Gestion des profils',
          //   url: '/profil'
          // },
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