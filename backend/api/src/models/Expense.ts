import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExpenseDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  iid: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  upload_date: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: string;

  constructor(expense: ExpenseDto) {
    Object.assign(this, expense);
  }
}

export class NewExpenseDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  upload_date: string;

  constructor(expense: NewExpenseDto) {
    Object.assign(this, expense);
  }
}

export class NewExpensesDto {
  @ApiProperty({
    type: [NewExpenseDto],
  })
  @IsNotEmpty()
  expenses: NewExpenseDto[];

  constructor(expenses: NewExpensesDto) {
    Object.assign(this, expenses);
  }
}
