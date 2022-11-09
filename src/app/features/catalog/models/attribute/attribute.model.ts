import { Product } from "../product/product.model";

export class Attribute {
  attribute_id!: number;
  attribute_uuid!: string;
  camera?: string;
  graphics_card?: string;
  processor?: string;
  ram?: number;
  storage?: number;
  storage_type?: string;
  system?: string;
  createdAt?: Date;
  updatedAt?: Date;
  fk_product_id!: number;
  product?: Product;
  }
