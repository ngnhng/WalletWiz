import { Controller, Version, Get, Param, Body, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExpenseDto } from '../models/Expense';
import { ExpensesService } from '../services/expenses.service';

@ApiTags('expenses')
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Version('1')
  @Get('/v1/expenses/user/:user_id')
  @ApiOperation({ summary: 'Get all expenses by user' })
  @ApiResponse({
    status: 200,
    description: 'All expenses have been successfully obtained.',
    type: ExpenseDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getByUser(@Param('user_id') user_id: string): Promise<ExpenseDto[]> {
    return this.expensesService.getExpensesByUser(user_id);
  }

  @Version('1')
  @Get('/v1/expenses/category/:category_id')
  @ApiOperation({ summary: 'Get all expenses by category' })
  @ApiResponse({
    status: 200,
    description: 'All expenses have been successfully obtained.',
    type: ExpenseDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getByCategory(
    @Param('category_id') category_id: string,
  ): Promise<ExpenseDto[]> {
    return this.expensesService.getExpensesByCategory(category_id);
  }

  @Version('1')
  @ApiOperation({ summary: 'Add expense to category' })
  @Put('/v1/expenses/category/:category_id')
  @ApiResponse({
    status: 201,
    description: 'The expense has been successfully added.',
    type: ExpenseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async addExpense(
    @Param('category_id') category: string,
    @Param('expense_id') expense: string,
  ) {
    return this.expensesService.categorizeExpense(expense, category);
  }
}
