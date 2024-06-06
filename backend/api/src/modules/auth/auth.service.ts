import * as bcrypt from 'bcryptjs';

import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '~/services/users/users.service';
import Wwiz from '~/Wwiz';
import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { genJwt } from '~/services/users/helper';
import { CreateUserDto, UserDto, UserRefreshTokenDto } from '~/models/User';
import { WwizError } from '../../helpers/catch-error';
import { AtRtTokenDto } from '../../models/AtRtToken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const { encrypted_password, salt, ...result } = user;

      // make bcrypt hash return a promise so we can use async/await
      const hashedPassword = await promisify(bcrypt.hash)(pass, user.salt);
      if (user.encrypted_password === hashedPassword) {
        return result;
      }
    }
    return null;
  }

  async basicLogin(email: string, password: string) {
    const validUser = await this.validateUser(email, password);
    if (validUser) {
      const user = await this.updateTokenVersion(email);
      if (!user) {
        WwizError.notFound({
          customMessage: 'User not found',
        });
      }
      return await this.login(user);
    }
    WwizError.unauthorized({
      customMessage: 'Credentials is incorrect',
    });
  }

  async login(user: UserDto) {
    const payload = user;
    return {
      access_token: genJwt(payload, Wwiz.getConfig()),
      refresh_token: genJwt(payload, Wwiz.getConfig(), 'refresh'),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const {
      email: _email,
      firstname,
      lastname,
      // token,
      // ignore_subscribe,
    } = createUserDto as any;

    let { password } = createUserDto;

    const email = _email.toLowerCase();

    let user = await this.usersService.findOne(email);

    const salt = await promisify(bcrypt.genSalt)(10);
    password = await promisify(bcrypt.hash)(password, salt);
    //const email_verification_token = uuidv4();

    if (!user) {
      await this.registerNewUserIfAllowed({
        firstname,
        lastname,
        email,
        salt,
        password,
        //email_verification_token,
      });
    }
    user = await this.usersService.findOne(email);

    return await this.login(user);
  }

  async registerNewUserIfAllowed({
    firstname,
    lastname,
    email,
    salt,
    password,
  }: {
    firstname;
    lastname;
    email: string;
    salt: any;
    password;
    //email_verification_token;
  }) {
    //const roles: string = UserRoles.WEB_USER;
    const token_version = ''; // randomTokenString();

    return await this.usersService.insert({
      firstname,
      lastname,
      email,
      salt,
      encrypted_password: password,
      token_version,
    });
  }

  async refreshToken(
    refreshPayload: UserRefreshTokenDto,
  ): Promise<AtRtTokenDto> {
    const { email, token_version } = refreshPayload;

    const user = await this.usersService.getByEmail(email);

    if (!user.token_version || user.token_version !== token_version) {
      WwizError.badRequest({
        customMessage: 'Token Invalidated. Please login again.',
      });
    }

    const refreshedUser = await this.updateTokenVersion(email);

    return this.login(refreshedUser);
  }

  private async updateTokenVersion(email: string) {
    const token_version = uuidv4();
    return this.usersService.updateTokenVersion({ email, token_version });
  }
}
