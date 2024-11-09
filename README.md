# CF Svelte Drizzle starter

## Getting started

### Create a database

```bash
pnpm dlx wrangler d1 create my-database
```

### Bind to your D1 database

Copy the lines obtained from the cli command above.

Add them to the wrangler.toml file. Particularly the database name and the id.

You'll also need to add your cloudflare account id, database id and d1 token to your .env file.

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
```

These can all be found in your cloudflare dashboard.

- https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/
- https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

### Bootstrap local db

Before starting any work you'll need to bootstrap the D1 database locally.

```bash
pnpm db:generate
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Creating and applying migrations

In this project we're using Drizzle as our ORM.

To create a migration:

```bash
pnpm db:generate
```

Apply that migration to the local db

```bash
pnpm db:migrate
```

### Seeding

Because D1 requires serverless bindings to interact with Drizzle we have an api route to seed our data `/api/seed`.

This is only available when the development environment.

We can seed our local db from this route by running

```bash
pnpm db:seed:local
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

## CI

In order for the CI workflows to run there's a couple of things you'll need to setup in GitHub.

You'll need to add the following to the repository secrets.

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
CLOUDFLARE_PAGES_API_TOKEN=
GH_TOKEN=
```

Your `CLOUDFLARE_PAGES_API_TOKEN` should be created in your CF account: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

And this should have at least **Workers Builds Configuration:Read, Cloudflare Pages:Read** permissions.

You'll also need to generate a GitHub access token with **Deployments** set to write.

https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#create-a-deployment

## Deployment

Deploy the database by running

```bash
pnpm deploy:db
```

Deploy pages by running

```bash
pnpm deploy:pages
```
