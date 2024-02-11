# ChipChat

## TODOS
- [x] Create/Join chat room by entering a name
- [x] Room users list
- [x] Get 10 last messages on connect
- [x] Read new messages
- [x] Send messages
- [x] Signup
- [x] Login
- [x] Admin (1st user) can kick users (i've implemented a ban system instead)
- [ ] Tests

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

## Notes

### How I organized my time
- Friday evening : Init the project, setup the environment and user auth.
- Saturday morning : Little bit of refactoring / small fixes
- Saturday afternoon : Chat room features (I consider the app to be feature complete and I could have stop here)
- Sunday morning : Little bit of refactoring / small fixes

### What would I've done with more time
- Implement a mailing service for the auth process (email confirmation, password reset etc.).
- Implement a passwordless auth system.
- Find a better way to pass validation data between auth api calls and the forms but the cookie system i've used looks good enough.
- Use an ORM for the database but I wanted to try this approach of raw mongodb driver + zod + ts in a kind off repository structure.
- Better logging system.
- Better error handling.
- Better testing, specially unit testing.
- Better kick and ban system : possibility to unban users, removing/obfuscating targeted user messages.

### What would I've done if it was a real project
- Use a component library like `nuxt/ui`.
- Use a more robust authentication system, maybe something external like Auth0 or simplify Oauth providers.
- Maybe split the socket server in a separate service decoupled of the main app. Nuxt 3 doesn't seem to be fully ready for this kind of usage (waiting for `unjs/crossws` package to be production ready).
