import { Controller, Version, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReceiptDto } from '../models/Receipt';
import { ReceiptsService } from '../services/receipts.service';

@ApiTags('receipts')
@Controller()
export class ReceiptsController {
  constructor(protected readonly receiptsService: ReceiptsService) {}

  @Version('1')
  @Get('/v1/receipts/user/:user_id')
  @ApiOperation({ summary: 'Get all receipts by user' })
  @ApiResponse({
    status: 200,
    description: 'All receipts have been successfully obtained.',
    type: ReceiptDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getByUser(@Param('user_id') user_id: string): Promise<ReceiptDto[]> {
    return this.receiptsService.getByUser(user_id);
  }
}
