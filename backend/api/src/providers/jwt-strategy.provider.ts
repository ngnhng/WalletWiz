import { Provider } from '@nestjs/common';
import { UsersService } from '~/services/users/users.service';
import { JwtStrategy } from '~/strategies/jwt.strategy';
import Wwiz from '../Wwiz';

export const JwtStrategyProvider: Provider = {
  provide: JwtStrategy,
  useFactory: async (usersService: UsersService) => {
    await Wwiz.initJwt();

    const options = {
      secretOrKey: Wwiz.getConfig().auth.jwt.secret,
    };

    return new JwtStrategy(options, usersService);
  },
  inject: [UsersService],
};
