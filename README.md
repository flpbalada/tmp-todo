## Requirements

- Node.js 24.19
- pnpm 11.21
- Docker with Compose

## Local Development

```bash
pnpm install
cp .env.example .env
```

In `.env`, replace both occurrences of the example database password and generate `PAYLOAD_SECRET` with:

```bash
openssl rand -hex 32
```

Start PostgreSQL, apply migrations, and start the app:

```bash
docker compose up -d
pnpm payload:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). On a fresh database, create the first administrator at [http://localhost:3000/admin/create-first-user](http://localhost:3000/admin/create-first-user).

Administrators create app users in the Payload `Users` collection. Public registration is disabled.

Stop PostgreSQL with `docker compose down`. Add `--volumes` to delete its data.

## Payload Schema Changes

After changing a Payload schema, regenerate its files and create a migration:

```bash
pnpm payload:generate:types
pnpm payload:generate:importmap
pnpm payload:migrate:create descriptive-migration-name
```

Commit the generated types, admin import map, and migration files. Apply migrations with `pnpm payload:migrate`.

Database push is disabled. Do not run `pnpm payload:migrate:fresh` against a database whose data must be retained.

## Verification

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
docker compose config --quiet
docker compose -f compose.prod.yaml config --quiet
```

## Integration Tests

The todo integration tests use the PostgreSQL database configured by `DATABASE_URL`. Start PostgreSQL and apply migrations before running them:

```bash
docker compose up -d
pnpm payload:migrate
pnpm test:integration
```

The suite creates uniquely named fixtures and deletes only those records. It never truncates collections, but an interrupted run may leave test-prefixed records in the development database.

## Production

Use the same `.env` setup as local development. Do not commit it.

Build and start PostgreSQL, migrations, the app, and Nginx:

```bash
docker compose -f compose.prod.yaml up --build
```

Open [http://localhost](http://localhost). Set `HTTP_PORT` in `.env` to use another host port.

Stop the stack with `docker compose -f compose.prod.yaml down`. Add `--volumes` to delete production data.
