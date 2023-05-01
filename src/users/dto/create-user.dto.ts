import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_TYPE } from '@prisma/client';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ enum: USER_TYPE })
  type?: USER_TYPE;
}
