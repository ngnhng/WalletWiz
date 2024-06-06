import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '~/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    options: {
      secretOrKey: string;
    },
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      expiresIn: '10h',
      ...options,
    });
  }

  async validate(payload) {
    if (!payload?.email) {
      return payload;
    }

    const user = await this.userService.getByEmail(payload?.email);

    if (
      !user.token_version ||
      !payload.token_version ||
      user.token_version !== payload.token_version
    ) {
      throw new Error('Token Expired. Please login again.');
    }

    return user;
  }
}
