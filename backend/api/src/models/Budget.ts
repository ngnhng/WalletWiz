import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BudgetHistoriesDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  limit: string;

  @ApiProperty()
  @IsNotEmpty()
  reset_day: number;

  @ApiProperty()
  @IsNotEmpty()
  valid_from: string;

  @ApiProperty()
  @IsNotEmpty()
  valid_to: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: string;

  constructor(budget: BudgetHistoriesDto) {
    Object.assign(this, budget);
  }
}
