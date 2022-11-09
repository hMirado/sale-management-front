import { Attribute } from "../attribute/attribute.model";
import { Category } from "../category/category.model";

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
  attributes?: Attribute[];
}
