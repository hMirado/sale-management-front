import { Company } from "../company/company.model";
export class Shop {
  shop_id!: number;
  shop_uuid!: string;
  shop_code!: string;
  shop_name!: string;
  shop_location!: string;
  shop_box?: string;
  city!: string;
  status!: boolean;
  shop_login!: string;
  companyCompanyId!: number;
  createdAt?: Date;
  updatedAt?: Date;
  company?: Company;
  is_opened: boolean;
}
