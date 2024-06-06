## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Migration
We use Knex.js for migration. To run migration, use the following command:

```bash
$ pnpm dlx knex migrate:latest
```

### Create a new migration
```bash
$ pnpm dlx knex migrate:make migration_name
```

### Rollback migration
```bash
$ pnpm dlx knex migrate:rollback
```


