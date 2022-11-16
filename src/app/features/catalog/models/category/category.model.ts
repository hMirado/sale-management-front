import { Product } from "../product/product.model";

export class Category {
  category_id!: number;
  category_uuid!: string;
  code!: string;
  label!: string;
  createdAt?: Date;
  updatedAt?: Date;
  products?: Product[];
}
