import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Specific user', type: User })
  @ApiBadRequestResponse({ description: 'Bad request' })
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
