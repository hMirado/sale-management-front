import { IAuthorization } from "../i-authorization/i-authorization";
export class Role {
  role_id!: number;
  role_uuid!: string;
  role_key!: string;
  role_name!: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorizations?: IAuthorization[]
}
