import { Controller, Get, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from '../services/budgets.service';

@ApiTags('budgets')
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
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getByUser(user_id: string) {
    return this.budgetsService.getByUser(user_id);
  }
}
