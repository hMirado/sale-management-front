import { Product } from "./product/product.model";
import { Shop } from "./shop/shop.model";
import { TransferStatus } from "./transfer-status/transfer-status.model";
import { TransferType } from "./transfer-type/transfer-type.model";
import { User } from "./user/user.model";

export class Transfer {
  transfer_id: number
  transfer_uuid: string;
  transfer_quantity: number;
  transfer_commentary?: string;
  createdAt: Date;
  updatedAt: Date;
  transfer_status!: TransferStatus;
  product!: Product;
  user_sender!: User;
  user_receiver!: User;
  shop_sender!: Shop;
  shop_receiver!: Shop;
}

