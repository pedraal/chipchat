# ChipChat

## Setup

### Prerequisites
- MongoDB 6 (if docker is setup you can use the `docker-compose.env.yml` file to start one)
- Node 20
- pnpm 8

### Install the app
Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Test

Install playwright

```bash
pnpm exec playwright-core install
```

Then run test :

```bash
pnpm test
```

You can also run the test in the nuxt devtools within the Vitest tab when running the development server.
