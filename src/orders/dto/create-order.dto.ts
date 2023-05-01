import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  parcelId: string;

  @IsNotEmpty()
  pickupDate: string;

  @IsNotEmpty()
  dropoffDate: string;
}
