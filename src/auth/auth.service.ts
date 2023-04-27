import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { exclude } from 'src/utils/exclude';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return exclude(user, ['password', 'createdAt', 'updatedAt']);
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      accessToken: this.jwtService.sign({
        email,
        sub: user.id,
        type: user.type,
      }),
    };
  }
}
