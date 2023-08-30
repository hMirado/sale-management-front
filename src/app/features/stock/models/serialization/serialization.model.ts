import { Product } from "src/app/features/catalog/models/product/product.model";
import { Shop } from "src/app/features/setting/models/shop/shop.model";
import { SerializationType } from "../serialization-type/serialization-type.model";

export class Serialization {
  serialization_id: number;
  serialization_uuid: string
  serialization_value: string
  attribute_serialization?: string
  createdAt?: Date;
  updatedAt?: Date;
  fk_product_id: number;
  product_uuid: string;
  fk_serialization_type_id: number;
  fk_shop_id: number;
  shop_uuid?: string;
  serialization_type?: SerializationType;
  shop?: Shop;
  product?: Product;
  code?: string;
  label?: string;
  is_sold?: boolean;
  is_in_transfer?: boolean;
  group_id: string;
}
