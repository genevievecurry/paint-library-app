# Paint Library App

Node Version: `v16.12.0`

Env: `$ cp .example.env .env`

## Developing

```bash
npm install

npx prisma generate
```

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Database

This project uses Prisma.io & PostgreSQL.

Note: the following is important at the beginning of the first migration.sql:

```
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Schema is: [schema.prisma](./prisma/schema.prisma)

**Introspect**

`npx prisma db pull`

**Run Migrations:**

`npm run migrate:dev`

**Seed:**

`npm run seed`

**Reset Database & Seed:**

`npm run migrate:reset`

After firing up the app with `npm run dev`, you can try navigating to [http://localhost:3000/swatch/watercolor-swatch](http://localhost:3000/swatch/watercolor-swatch) to see a seeded swatch (the only route at the moment).

**Note:** You'll need to make sure you have your .env configured to use a postgresql superuser. Hopefully you already have user 'postgres' with the same password & will not need to do anything.

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
