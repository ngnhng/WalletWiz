import { Provider } from '@nestjs/common';
import { SentryService } from './sentry.service';
import { SENTRY_TOKEN } from '~/constants';
import { SentryModuleOptions } from '~/interface/sentry';

export function createSentryProviders(options: SentryModuleOptions): Provider {
  return {
    provide: SENTRY_TOKEN,
    useValue: new SentryService(options),
  };
}
