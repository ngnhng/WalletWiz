import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { BudgetDto } from '../models/Budget';
import { Tables } from '../utils/globals';

@Injectable()
export class BudgetsService {
  private logger = new Logger(BudgetsService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(budget: BudgetDto) {
    return this.knex<BudgetDto>(Tables.BUDGETS).insert(budget);
  }

  async getBudgetsByUser(user_id: string) {
    return this.knex<BudgetDto>(Tables.BUDGETS).where({ user_id });
  }

  async getBudgetById(id: string) {
    return this.knex<BudgetDto>(Tables.BUDGETS).where({ id }).first();
  }

  async getByUser(user_id: string) {
    return this.knex<BudgetDto>(Tables.BUDGETS).where({ user_id });
  }
}
