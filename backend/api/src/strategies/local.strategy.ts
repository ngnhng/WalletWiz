import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '~/modules/auth/auth.service';
import { WwizError } from '~/helpers/catch-error';
import { RolesType, RolesObj } from '~/utils/globals';
import { AppConfig } from '~/interface/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private config: ConfigService<AppConfig>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    if (this.config.get('auth.disableEmailAuth', { infer: true }))
      WwizError.forbidden({
        customMessage: 'Email authentication is disabled',
      });

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      WwizError.badRequest({
        customMessage: 'Invalid credentials',
      });
    }

    user.roles = extractRolesObj(user.roles);

    return user;
  }
}

const extractRolesObj = (roles: RolesType): RolesObj => {
  if (!roles) return null;

  if (typeof roles === 'object' && !Array.isArray(roles)) return roles;

  if (typeof roles === 'string') {
    roles = roles.split(',');
  }

  if (roles.length === 0) return null;

  return roles.reduce((acc, role) => {
    acc[role] = true;
    return acc;
  }, {});
};
