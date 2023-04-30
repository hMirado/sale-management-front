import { Serialization } from "./serialization";

export interface Product {
  product_uuid: string;
  label: string;
  quantity: number;
  is_serializable: boolean;
  serializations?: Serialization[]
}
