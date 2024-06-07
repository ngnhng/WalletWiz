import {
  BadRequestException,
  Catch,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';

import { SentryService } from '~/modules/sentry/sentry.service';
import { InjectSentry } from '~/modules/sentry/sentry.decorator';
import {
  WwizBaseError,
  WwizErrorType,
  extractDBError,
} from '~/helpers/catch-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    @Optional() @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    exception = this.handleBadRequestException(exception);

    this.sentryClient?.instance().setContext('Request', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    this.sentryClient?.instance().setContext('Response', {
      statusCode: response.statusCode,
      headers: response.getHeaders(),
    });
    this.sentryClient?.instance().setContext('Exception', {
      name: exception.name,
      message: exception.message,
      stack: exception.stack,
    });

    this.sentryClient?.instance().captureException(exception);

    this.logger.error(exception.stack);

    const dbError = this.getDatabaseError(exception);

    if (this.shouldLogError(exception, dbError)) {
      this.logError(exception, request);
    }

    if (exception instanceof ThrottlerException) {
      this.logger.error('ThrottlerException');
      this.handleThrottlerException(exception, request);
    } else if (exception instanceof NotFoundException) {
      this.logger.error('NotFoundException');
      this.handleNotFoundException(exception, response);
    } else if (dbError) {
      this.logger.error('DatabaseError');
      this.handleDatabaseError(response, dbError);
    } else if (
      exception instanceof BadRequestException ||
      this.isBadRequest(exception)
    ) {
      this.logger.error('BadRequest');
      this.handleBadRequest(response, exception);
    } else if (exception instanceof WwizBaseError) {
      this.logger.error('WwizBaseError');
      this.handleWwizBaseError(response, exception);
    } else {
      this.logger.error('UnknownException');
      this.handleUnknownException(response, exception, request);
    }
  }

  private handleBadRequestException(exception: any) {
    if (
      exception.name === 'BadRequestException' &&
      exception.status === 400 &&
      /^Unexpected token .*? in JSON/.test(exception.message)
    ) {
      return new WwizBaseError(WwizErrorType.BAD_JSON);
    }
    return exception;
  }

  private getDatabaseError(exception: any) {
    return exception instanceof WwizBaseError
      ? null
      : extractDBError(exception);
  }

  private shouldLogError(exception: any, dbError: any) {
    const enableAllApiErrorLogging =
      process.env.WWIZ_ENABLE_ALL_API_ERROR_LOGGING === 'true';
    const skipLogging =
      dbError ||
      exception instanceof NotFoundException ||
      exception instanceof ThrottlerException ||
      (exception instanceof WwizBaseError &&
        ![
          WwizErrorType.INTERNAL_SERVER_ERROR,
          WwizErrorType.DATABASE_ERROR,
          WwizErrorType.UNKNOWN_ERROR,
          WwizErrorType.BAD_REQUEST,
          WwizErrorType.BAD_JSON,
          WwizErrorType.UNAUTHORIZED,
          WwizErrorType.FORBIDDEN,
          WwizErrorType.NOT_FOUND,
          WwizErrorType.NOT_IMPLEMENTED,
        ].includes(exception.error));

    return enableAllApiErrorLogging || !skipLogging;
  }

  private handleThrottlerException(
    exception: ThrottlerException,
    request: Request,
  ) {
    this.logger.warn(`${exception.message}, Path: ${request.path}`);
  }

  private handleNotFoundException(
    exception: NotFoundException,
    response: Response,
  ) {
    // if exception is favicon.ico, ignore it
    if (/^Cannot GET \/favicon.ico/.test(exception.message))
      this.logger.debug(exception.message, exception.stack);
    response.status(404).json({ msg: exception.message });
  }

  private handleDatabaseError(response: Response, dbError: any) {
    response.status(400).json(dbError);
  }

  private isBadRequest(exception: any) {
    return exception.getStatus?.() === 400;
  }

  private handleBadRequest(response: Response, exception: any) {
    response.status(400).json({ msg: exception.message });
  }

  private handleWwizBaseError(response: Response, exception: WwizBaseError) {
    response.status(exception.code).json({
      error: exception.error,
      message: exception.message,
      details: exception.details,
    });
  }

  private handleUnknownException(
    response: Response,
    exception: any,
    request: Request,
  ) {
    this.logError(exception, request);

    if (exception.getStatus?.()) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      this.captureException(exception, request);
      response.status(400).json({ msg: exception.message });
    }
  }

  private captureException(exception: any, _request: any) {
    this.sentryClient?.instance().captureException(exception);
  }

  private logError(exception: any, _request: any) {
    this.logger.error(exception.message, exception.stack);
  }
}
