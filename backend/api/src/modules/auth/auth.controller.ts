import { Body, Controller, Post, UseGuards, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicApiLimiterGuard } from '~/guards/public-throttler.guard';
import { UserRoles } from '~/utils/globals';
import {
  CreateUserDto,
  UserDto,
  UserLoginDto,
  UserRefreshTokenDto,
} from '~/models/User';
import { AtRtTokenDto } from '~/models/AtRtToken';

import { User } from '~/decorators/user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from '~/decorators/public-api.decorator';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Version('1')
  @Public()
  @UseGuards(PublicApiLimiterGuard)
  @Post(['/v1/auth/users/signup'])
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<AtRtTokenDto> {
    const role = UserRoles.WEB_USER;
    const token_version = '';
    return this.authService.signup({
      ...createUserDto,
    });
  }

  @Version('1')
  @Public()
  @UseGuards(PublicApiLimiterGuard)
  @Post(['/v1/auth/users/login'])
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async login(
    @Body() { email, password }: UserLoginDto,
  ): Promise<AtRtTokenDto> {
    return this.authService.basicLogin(email, password);
  }

  @Version('1')
  @Post(['/v1/auth/token/refresh'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'The token has been successfully refreshed.',
    type: UserDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async refreshToken(
    @User() user: UserDto,
    @Body() { token }: { token: string },
  ): Promise<AtRtTokenDto> {
    return this.authService.refreshToken({
      old_token: token,
      token_version: user.token_version,
      email: user.email,
    });
  }
}
