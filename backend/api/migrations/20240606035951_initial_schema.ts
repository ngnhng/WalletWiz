import type { Knex } from 'knex';
import * as fs from 'fs';
import * as path from 'path';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8'));
}

export async function down(knex: Knex): Promise<void> {}
