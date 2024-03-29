# Paint Library App

The Paint Library is a project fueled primarily by my interest in collecting and exploring data, it also gave me an opportunity to explore Svelte and SvelteKit (which are both really lovely to work with).

> **Note**
> This project is on a bit of a hiatus. Although it provided a really great productivity boost at the start and was fun to work with, using a fairly early pre-1.0 version of SvelteKit was a poor choice on my part. I misjudged how quickly I could keep up with their releases and address breaking changes, and after taking a coding break of a few months, it turned into the type of chore that really spells the end for a casual side project. I hope to return to it at some point and rebuild the backend.

## Details

This app uses [SvelteKit](https://kit.svelte.dev/) ✨

Node Version: `v16.12.0`

PostgreSQL: `13`

Env: `$ cp .example.env .env`

> **Note**
> you will have to ask for the imagekit/sendgrid .env secrets

## Developing

A postgres database must provisioned; once it is setup, use `$ npx prisma generate` & `$ npx prisma migrate dev` to apply migrations & seed.

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

### Migration How To's

Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)

`$ npx prisma migrate dev`

Reset your database and apply all migrations

`$ npx prisma migrate reset`

Apply pending migrations to the database in production/staging

`$ npx prisma migrate deploy`

Check the status of migrations in the production/staging database

`$ npx prisma migrate status`

### Database/Schema How To's

Provision database
`createdb library`

Download & restore production database dump

```
$ heroku pg:backups:download --app paint-library-app
$ pg_restore --verbose --clean --no-acl --no-owner -h localhost -U postgres -d library latest.dump
```

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
