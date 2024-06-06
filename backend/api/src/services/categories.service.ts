import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CategoryDto } from '../models/Category';
import { Tables } from '../utils/globals';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(category: CategoryDto) {
    return this.knex<CategoryDto>(Tables.CATEGORIES).insert(category);
  }

  async getCategoryById(id: string) {
    return this.knex<CategoryDto>(Tables.CATEGORIES).where({ id }).first();
  }
}
