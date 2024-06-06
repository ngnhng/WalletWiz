import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BudgetDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  month: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: string;

  constructor(budget: BudgetDto) {
    Object.assign(this, budget);
  }
}
