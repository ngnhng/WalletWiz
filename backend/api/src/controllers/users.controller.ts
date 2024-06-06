import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '~/services/users/users.service';
import { AppConfig } from '~/interface/config';
import { User } from '../decorators/user.decorator';
import { UserDto, UserMeDto } from '../models/User';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly config: ConfigService<AppConfig>,
  ) {}

  @Version('1')
  @Get('/v1/users/me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'The current user has been successfully obtained.',
    type: UserMeDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getMe(@User() { email }: UserDto): Promise<UserMeDto> {
    return this.usersService.getByEmail(email);
  }
}
