import { Serialization } from "../../serialization/serialization.model";

export class Product {
  product_id: number;
  product_uuid: string;
  code: string;
  label: string;
  fk_category_id?: number
  is_serializable?: boolean;
  serializations?: Serialization[];
}
