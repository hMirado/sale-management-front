import { Category } from "../category/category.model";
import { Stock } from "../stock/stock.model";

export class Product {
  product_id!: number;
  product_uuid!: string;
  code!: string;
  label!: string;
  ht_price!: number;
  ttc_price!: number;
  is_serializable!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fk_category_id!: number;
  category!: Category;
  stock?: Stock;
}
