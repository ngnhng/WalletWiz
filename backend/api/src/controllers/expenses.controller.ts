import {
  Controller,
  Version,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExpenseDto, NewExpenseDto, NewExpensesDto } from '../models/Expense';
import { ExpensesService } from '../services/expenses.service';
import { User } from '../decorators/user.decorator';
import { UserDto } from '../models/User';

@ApiTags('expenses')
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Version('1')
  @Get('/v1/expenses')
  @ApiOperation({ summary: 'Get all expenses by user' })
  @ApiResponse({
    status: 200,
    description: 'All expenses have been successfully obtained.',
    type: ExpenseDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getByUser(@User() user: UserDto): Promise<ExpenseDto[]> {
    const user_id = user.id;
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
  @Post('/v1/expenses/category/:category_id')
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

  @Version('1')
  @ApiOperation({ summary: 'Remove expense from category' })
  @Delete('/v1/expenses/category/:category_id')
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully removed.',
    type: ExpenseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async removeExpense(@Param('category_id') category) {
    return this.expensesService.uncategorizeExpense(category);
  }

  @Version('1')
  @ApiOperation({ summary: 'Add multiple expenses by user' })
  @Post('/v1/expenses')
  @ApiResponse({
    status: 201,
    description: 'The expenses have been successfully added.',
    type: NewExpensesDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async addExpenses(@User() user: UserDto, @Body() expenses: NewExpensesDto) {
    const userId = user.id;
    return this.expensesService.addExpenses(userId, expenses);
  }

  @Version('1')
  @ApiOperation({ summary: 'Edit user expense' })
  @Patch('/v1/expenses/:expense_id')
  @ApiResponse({
    status: 200,
    description: 'The expense has been successfully edited.',
    type: ExpenseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBearerAuth()
  async editExpense(
    @User() user: UserDto,
    @Param('expense_id') expenseId: string,
    @Body() payload: ExpenseDto,
  ): Promise<ExpenseDto> {
    const userId = user.id;
    return this.expensesService.updateExpense(userId, payload);
  }
}
