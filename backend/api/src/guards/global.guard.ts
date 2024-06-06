import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_API } from '../constants';

@Injectable()
export class GlobalGuard extends AuthGuard(['jwt']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(PUBLIC_API, [
      context.getHandler(),
      context.getClass(),
    ])
      ? true
      : super.canActivate(context);

    //const request = context.switchToHttp().getRequest();

    //if (request.path === '/api/metrics') {
    //  return true;
    //}
  }
}
