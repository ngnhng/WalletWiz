import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ReceiptDto } from '../models/Receipt';
import { Tables } from '../utils/globals';

@Injectable()
export class ReceiptsService {
  private logger = new Logger(ReceiptsService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(receipt: ReceiptDto) {
    return this.knex<ReceiptDto>(Tables.RECEIPTS).insert(receipt);
  }

  async getReceiptsByUser(user_id: string) {
    return this.knex<ReceiptDto>(Tables.RECEIPTS).where({ user_id });
  }

  async getReceiptById(id: string) {
    return this.knex<ReceiptDto>(Tables.RECEIPTS).where({ id }).first();
  }

  async getByUser(user_id: string) {
    return this.knex<ReceiptDto>(Tables.RECEIPTS).where({ user_id });
  }
}
