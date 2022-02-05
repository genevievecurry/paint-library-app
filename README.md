# Paint Library App

Node Version: `v16.12.0`

PostgreSQL: `13`

Env: `$ cp .example.env .env`

## Developing

A postgres database must provisioned; once it is setup, use `$ npx prisma migrate dev` to apply migrations & seed. 

```bash
npm install
```

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Database

This project uses Prisma.io & PostgreSQL.

Schema is: [schema.prisma](./prisma/schema.prisma)

### Migration How To's ### 
Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)

`$ npx prisma migrate dev`

Reset your database and apply all migrations

`$ npx prisma migrate reset`

Apply pending migrations to the database in production/staging

`$ npx prisma migrate deploy`

Check the status of migrations in the production/staging database

`$ npx prisma migrate status`

### Database/Schema How To's ###
Pull the state from the database to the Prisma schema using introspection

`$ npx prisma db pull`

Push the state from Prisma schema to the database during prototyping

`$ npx prisma db push`

Seed your database

`$ npx prisma db seed`


**Note:** You'll need to make sure you have your .env configured to use a postgresql superuser. Hopefully you already have user 'postgres' with the same password & will not need to do anything.

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
