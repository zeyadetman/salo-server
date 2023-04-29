import { PartialType } from '@nestjs/swagger';
import { ORDER_STATUS } from '@prisma/client';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  status: ORDER_STATUS;
}
