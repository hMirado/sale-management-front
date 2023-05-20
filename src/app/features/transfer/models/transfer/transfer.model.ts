import { Product } from "src/app/features/catalog/models/product/product.model";
import { Shop } from "./shop/shop.model";
import { TransferStatus } from "./transfer-status/transfer-status.model";
import { User } from "./user/user.model";
import { Serialization } from "src/app/features/stock/models/serialization/serialization.model";

export class Transfer {
  transfer_id: number
  transfer_uuid: string;
  transfer_code: string;
  transfer_commentary?: string;
  createdAt: Date;
  updatedAt: Date;
  transfer_status!: TransferStatus;
  user_sender!: User;
  user_receiver!: User;
  shop_sender!: Shop;
  shop_receiver!: Shop;
  products!: Product[];
  serializations: Serialization[] 
}

