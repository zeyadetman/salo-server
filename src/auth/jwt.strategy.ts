import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration().jwtSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}
