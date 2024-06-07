import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // add  budget_limit DECIMAL(10, 2) NOT NULL,
  //budget_reset_day INTEGER NOT NULL CHECK (budget_reset_day BETWEEN 1 AND 28),
  // to users table
  await knex.schema.alterTable('users', (table) => {
    table.decimal('budget_limit', 10, 2);
    table.integer('budget_reset_day').checkBetween([1, 28]);
  });

  // drop the budgets table
  await knex.schema.dropTable('budgets');

  // create budget_histories
  knex.schema.createTable('budget_histories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.decimal('limit', 10, 2).notNullable();
    table.integer('reset_day').notNullable().checkBetween([1, 28]);
    table.timestamp('valid_from').notNullable().defaultTo(knex.fn.now());
    table.timestamp('valid_to').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // drop budget_limit and budget_reset_day columns from users table
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('budget_limit');
    table.dropColumn('budget_reset_day');
  });

  // create the budgets table
  await knex.schema.createTable('budgets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.decimal('amount', 10, 2).notNullable();
    table.date('month').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // drop the budget_histories table
  await knex.schema.dropTable('budget_histories');
}
