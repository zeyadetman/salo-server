import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { USER_TYPE } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ enum: USER_TYPE })
  role?: USER_TYPE;
}
