export interface IAuthorization {
  authorization_id: number;
  authorization_uuid: string;
  authorization_key: string;
  authorization_parent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}