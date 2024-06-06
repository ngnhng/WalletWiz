import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  expense_id: number;

  @ApiProperty()
  @IsNotEmpty()
  upload_date: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: string;

  constructor(receipt: ReceiptDto) {
    Object.assign(this, receipt);
  }
}
