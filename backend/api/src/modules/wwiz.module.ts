import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '~/services/users/users.service';
import { UsersController } from '~/controllers/users.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtStrategyProvider } from '~/providers/jwt-strategy.provider';
import { ReceiptsController } from '~/controllers/receipts.controller';
import { ReceiptsService } from '../services/receipts.service';
import { ExpensesController } from '../controllers/expenses.controller';
import { BudgetsController } from '../controllers/budgets.controller';
import { ExpensesService } from '../services/expenses.service';
import { BudgetsService } from '../services/budgets.service';

export const moduleConfig = {
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // config for PublicThrottlerGuard
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 10,
      },
    ]),
  ],
  controllers: [
    UsersController,
    ReceiptsController,
    ExpensesController,
    BudgetsController,
  ],
  providers: [
    JwtStrategyProvider,
    UsersService,
    ReceiptsService,
    ExpensesService,
    BudgetsService,
  ],
  exports: [UsersService, ReceiptsService, ExpensesService, BudgetsService],
};

@Module(moduleConfig)
export class WwizModule {}
