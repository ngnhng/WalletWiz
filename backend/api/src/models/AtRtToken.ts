import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtRtTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string;

  constructor(atRtToken: AtRtTokenDto) {
    Object.assign(this, atRtToken);
  }
}
