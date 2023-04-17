import { Product } from "src/app/features/catalog/models/product/product.model";
import { Shop } from "src/app/features/setting/models/shop/shop.model";

export class Stock {
  stock_id: number;
  stock_uuid: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  fk_shop_id: number;
  shop?: Shop
  fk_product_id: number;
  product?: Product
}
