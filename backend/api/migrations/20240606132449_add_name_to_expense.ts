import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // add name column to expense table
  await knex.schema.table('expenses', (table) => {
    table.string('name').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // drop name column from expense table
  await knex.schema.table('expenses', (table) => {
    table.dropColumn('name');
  });
}
