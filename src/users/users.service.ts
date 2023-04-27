import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_TYPE } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { exclude } from 'src/utils/exclude';

export const hashingRounds = 5;
@Injectable()
export class UsersService {
  constructor(readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      hashingRounds,
    );

    createUserDto.password = hashedPassword;
    createUserDto.type =
      USER_TYPE[createUserDto.type] || USER_TYPE[USER_TYPE.SENDER];

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return exclude(user, ['password', 'createdAt', 'updatedAt']);
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
