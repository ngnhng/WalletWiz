import { IsEmail, IsNotEmpty, Length } from 'class-validator';
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
  @Length(6, 255)
  encrypted_password?: string;

  @ApiProperty()
  @IsNotEmpty()
  token_version: string;

  @ApiProperty()
  @IsNotEmpty()
  salt?: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
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
