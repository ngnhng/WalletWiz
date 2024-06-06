import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { WwizConfig } from '~/interface/config';
import { UserDto } from '~/models/User';

export function genJwt(
  user: UserDto & { extra?: Record<string, any> },
  config: WwizConfig,
  refresh?: 'refresh',
) {
  const expiresIn = refresh ? '7d' : '10h';
  return jwt.sign(
    {
      ...(user.extra || {}),
      email: user.email,
      id: user.id,
      token_version: user.token_version,
    },
    config.auth.jwt.secret,
    // todo: better typing
    { expiresIn, ...(config.auth.jwt.options as any) },
  );
}

export function randomTokenString(): string {
  return crypto.randomBytes(40).toString('hex');
}

export function setTokenCookie(res: Response, token): void {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    domain: process.env.WWIZ_BASE_HOST_NAME || undefined,
  };
  res.cookie('refresh_token', token, cookieOptions);
}
