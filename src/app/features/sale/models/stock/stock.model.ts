export class Stock {
  stock_id!: number;
  stock_uuid!: string;
  quantity!: number;
  fk_shop_id!: number;
  fk_product_id!: number;
  createdAt?: Date;
  updatedAt?: Date;
}
