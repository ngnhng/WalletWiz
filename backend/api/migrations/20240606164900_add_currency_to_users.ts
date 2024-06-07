import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // add a currency column to the users table
  await knex.schema.alterTable('users', (table) => {
    table.enum('currency', ['USD', 'EUR', 'GBP', 'VND']).defaultTo('USD');
  });
}

export async function down(knex: Knex): Promise<void> {
  // drop the currency column from the users table
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('currency');
  });
}
