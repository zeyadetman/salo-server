import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_TYPE } from '@prisma/client';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  password: string;

  @ApiPropertyOptional({ enum: USER_TYPE })
  type?: USER_TYPE;
}
