import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { WwizModule } from '~/modules/wwiz.module';

import { AuthService } from '~/modules/auth/auth.service';
import { AuthController } from '~/modules/auth/auth.controller';
import { BasicStrategy } from '~/strategies/basic.strategy';
import { LocalStrategy } from '~/strategies/local.strategy';

export const authModuleMetadata = {
  imports: [PassportModule, WwizModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, BasicStrategy],
  exports: [],
};

@Module(authModuleMetadata)
export class AuthModule {}
