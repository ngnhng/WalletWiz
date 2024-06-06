import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Tables } from '../utils/globals';
import { BudgetHistoriesDto } from '../models/Budget';

@Injectable()
export class BudgetsService {
  private logger = new Logger(BudgetsService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getBudgetHistoriesByUser(
    user_id: string,
  ): Promise<BudgetHistoriesDto[]> {
    return this.knex(Tables.BUDGET_HISTORIES).where({ user_id }).select('*');
  }
}
