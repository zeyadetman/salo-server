import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_TYPE } from '@prisma/client';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  @ApiPropertyOptional({ enum: USER_TYPE })
  readonly role?: USER_TYPE;
}
