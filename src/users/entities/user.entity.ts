import { Order, Parcel, USER_TYPE } from '@prisma/client';

export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  type: USER_TYPE;
  createdAt: Date;
  updatedAt: Date;
  parcels: Parcel[];
  orders: Order[];
}
