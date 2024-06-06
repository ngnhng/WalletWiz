import { Controller, Get, Param, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from '../services/budgets.service';
import { BudgetHistoriesDto } from '../models/Budget';

@ApiTags('budgetHistory')
@Controller()
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Version('1')
  @Get(['/v1/budgets/user/:user_id'])
  @ApiOperation({ summary: 'Get all budgets by user' })
  @ApiResponse({
    status: 200,
    description: 'All budgets have been successfully obtained.',
    isArray: true,
    type: BudgetHistoriesDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getByUser(@Param() user_id: string): Promise<BudgetHistoriesDto[]> {
    return this.budgetsService.getBudgetHistoriesByUser(user_id);
  }
}
