import { Product } from "./product";

export interface Transfer {
  user: string;
  shop_sender: string;
  shop_receiver: string;
  commentary?: string;
  products: Product[];
}
