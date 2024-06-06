import type { Knex } from 'knex';
require('dotenv').config();

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.WWIZ_DB_URL,
      database: process.env.WWIZ_DB_NAME || 'wwiz',
      user: process.env.WWIZ_DB_USER,
      password: process.env.WWIZ_DB_PASSWORD || 'root',
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.WWIZ_DB_NAME || 'wwiz',
      user: process.env.WWIZ_DB_USER,
      password: process.env.WWIZ_DB_PASSWORD || 'root',
      ssl: { rejectUnauthorized: true },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.WWIZ_DB_NAME || 'wwiz',
      user: process.env.WWIZ_DB_USER,
      password: process.env.WWIZ_DB_PASSWORD || 'root',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },
};

module.exports = config;
