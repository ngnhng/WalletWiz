import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '~/services/users/users.service';
import { AppConfig } from '~/interface/config';
import { User } from '../decorators/user.decorator';
import { EditUserBudgetDto, UserDto, UserMeDto } from '../models/User';
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

  @Version('1')
  @Patch('/v1/users/:user_id/budgets')
  @ApiOperation({ summary: 'Edit user budget' })
  @ApiResponse({
    status: 200,
    description: 'The user budget has been successfully edited.',
    isArray: true,
    type: UserDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async editBudget(
    @User() user: UserDto,
    @Param('user_id') user_id: string,
    @Body() payload: EditUserBudgetDto,
  ): Promise<UserDto> {
    if (user.id !== user_id) {
      throw new Error('Forbidden');
    }
    return this.usersService.editBudget(user_id, payload);
  }

  @Version('1')
  @Patch('/v1/users/:user_id/currency')
  @ApiOperation({ summary: 'Edit user currency' })
  @ApiResponse({
    status: 200,
    description: 'The user currency has been successfully edited.',
    isArray: true,
    type: UserDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async editCurrency(
    @User() user: UserDto,
    @Param('user_id') user_id: string,
    @Body() payload: EditUserBudgetDto,
  ): Promise<UserDto> {
    if (user.id !== user_id) {
      throw new Error('Forbidden');
    }
    return this.usersService.editCurrency(user_id, payload);
  }
}
