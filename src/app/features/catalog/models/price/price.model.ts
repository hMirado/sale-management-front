export class Price {
  price_id!: number;
  price_uuid!: string;
  ht_price!: number;
  ttc_price!: number;
  createdAt?: Date;
  updatedAt?: Date;
  fk_product_id!: number;
}
