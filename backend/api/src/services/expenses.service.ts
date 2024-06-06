import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ExpenseDto } from '../models/Expense';
import { Tables } from '../utils/globals';

@Injectable()
export class ExpensesService {
  private logger = new Logger(ExpensesService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(expense: ExpenseDto) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).insert(expense);
  }

  async getExpensesByUser(user_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({ user_id });
  }

  async getExpenseById(id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({ id }).first();
  }

  async getExpensesByUserAndCategory(user_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({
      user_id,
      category_id,
    });
  }

  async addExpenseToCategory(expense_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id });
  }

  async getExpensesByCategory(category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({
      category_id,
    });
  }

  async categorizeExpense(expense_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id });
  }

  async uncategorizeExpense(expense_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id: null });
  }

  async addExpenses(user_id: string, expenses: ExpenseDto[]) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).insert(
      expenses.map((expense) => ({ ...expense, user_id })),
    );
  }

  async updateExpense(user_id: string, expense: ExpenseDto) {
    await this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense.id, user_id })
      .update(expense);
    return this.getExpenseById(expense.id);
  }
}
