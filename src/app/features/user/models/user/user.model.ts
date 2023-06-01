import { Role } from "src/app/shared/models/role/role.model";
import { Shop } from "src/app/shared/models/shop/shop.model";

export class User {
  user_id?: number; 
  user_uuid?: string; 
  first_name?: string; 
  last_name?: string; 
  email?: string; 
  phone_number?: string; 
  password?: string;
  status?: boolean; 
  createdAt?: string; 
  updatedAt?: string; 
  fk_role_id?: number;
  shops?: Shop[];
  role?: Role;
}
