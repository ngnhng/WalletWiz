import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDecimal()
  @Min(1)
  @Max(28)
  budget_limit?: string;

  @ApiProperty()
  @IsNumber()
  budget_reset_day?: number;

  @ApiProperty()
  @Length(6, 255)
  encrypted_password?: string;

  @ApiProperty()
  @IsNotEmpty()
  token_version: string;

  @ApiProperty()
  @IsNotEmpty()
  salt?: string;

  @ApiProperty()
  @IsNotEmpty()
  currency?: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
  }
}

export class EditUserBudgetDto {
  @ApiProperty()
  @IsNotEmpty()
  limit?: string;

  @ApiProperty()
  @IsNotEmpty()
  reset_day?: number;

  @ApiProperty()
  @IsNotEmpty()
  currency?: string;

  constructor(budget: EditUserBudgetDto) {
    Object.assign(this, budget);
  }
}

export class UserMeDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  budget_limit: string;

  @ApiProperty()
  @IsNotEmpty()
  budget_reset_day: number;

  @ApiProperty()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  token_version: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
  }
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 255)
  password: string;
}

export class UserRefreshTokenDto {
  @IsNotEmpty()
  old_token: string;

  @IsNotEmpty()
  token_version: string;

  @IsEmail()
  email: string;
}

export class UserLoginDto {
  @ApiProperty()
  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
    },
    {
      message: 'Please provide a valid email address',
    },
  )
  email: string;

  @ApiProperty()
  @Length(6, 255, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;
}
