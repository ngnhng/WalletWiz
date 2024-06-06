import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class PublicApiLimiterGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //const request = context.switchToHttp().getRequest();
    //const response = context.switchToHttp().getResponse();

    const isRateLimited = await super.canActivate(context);
    if (!isRateLimited) {
      throw new ThrottlerException('Too many requests');
    }
    return true;
  }
}
