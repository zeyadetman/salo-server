import { IsNotEmpty } from 'class-validator';

export class CreateParcelDto {
  @IsNotEmpty()
  pickupAddress: string;

  @IsNotEmpty()
  dropoffAddress: string;

  @IsNotEmpty()
  name: string;
}
