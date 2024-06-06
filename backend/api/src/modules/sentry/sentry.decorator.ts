import { Inject } from '@nestjs/common';
import { SENTRY_TOKEN, SENTRY_MODULE_OPTIONS } from '~/constants';

/**
 * Creates a decorator that can be used as a convenience to inject a specific token
 *
 * Instead of using @Inject(SOME_THING_TOKEN) this can be used to create a new named Decorator
 * such as @InjectSomeThing() which will hide the token details from users making APIs easier
 * to consume
 * @param token
 */
export const makeInjectableDecorator =
  (token: string | symbol): (() => ParameterDecorator) =>
  () =>
    Inject(token);

export const InjectSentry = makeInjectableDecorator(SENTRY_TOKEN);

/**
 * Injects the Sentry Module config
 */
export const InjectSentryModuleConfig = makeInjectableDecorator(
  SENTRY_MODULE_OPTIONS,
);
