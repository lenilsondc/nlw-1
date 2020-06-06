# Ecoleta API

Express.js Restfull api for serving both frontend and mobile clients.

## Getting started

Create `.env` file by copying `.env.example` and setting up required configurations.

The express app is served on port `3333` so that into account when setting `SERVER_URL`.

Install dependencies.

```bash
npm install
```

Run `knex`migrations and seeds.

```bash
npm run knex:migrate
npm run knex:seed
```

Start development server.

```bash
npm start
```

## Extras

Import [Insomnia Workspace File](./tools/Insomnia_Workspace.json) available in project tools for testing api endpoints.
