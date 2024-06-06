import { Module } from '@nestjs/common';
import { AuthModule } from '~/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WwizModule } from '~/modules/wwiz.module';
import config from './app.config';
import { SentryModule } from './modules/sentry/sentry.module';
import { packageInfo } from './utils/package-version';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { GlobalGuard } from './guards/global.guard';
import { KnexModule } from 'nest-knexjs';

export const moduleConfig = {
  imports: [
    AuthModule,
    WwizModule,
    ConfigModule.forRoot({
      load: [() => config],
      isGlobal: true,
    }),
    // auth also needs access to the database
    // todo: move this to wwiz module and remove db logic from auth
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          connectionString: process.env.WWIZ_DB_URL,
          database: process.env.WWIZ_DB_NAME || 'wwiz',
          user: process.env.WWIZ_DB_USER,
          password: process.env.WWIZ_DB_PASSWORD || 'root',
          ssl: { rejectUnauthorized: false },
        },
        pool: {
          min: 2,
          max: 10,
        },
      },
    }),
    ...(process.env.WWIZ_SENTRY_DSN
      ? [
          SentryModule.forRoot({
            dsn: process.env.NC_SENTRY_DSN,
            debug: false,
            environment: process.env.NODE_ENV,
            release: packageInfo.version, // must create a release in sentry.io dashboard
            logLevels: ['debug'], //based on sentry.io loglevel //
          }),
        ]
      : []),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
  ],
};

@Module(moduleConfig)
export class AppModule {}
