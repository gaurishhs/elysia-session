# Elysia Session

## Features

- Runs in Bun, Cloudflare Workers, and those supported by Elysia.
- Flash messages — data that is deleted once it's read (one-off error messages, etc.)
- Built-in Memory, Bun SQLite and Cookie stores. 

## Installation 

```bash
bun a elysia-session
```

## Usage

```ts
import Elysia from "elysia";
import { sessionPlugin } from "./src";
import { CookieStore } from "./src/stores/cookie";

new Elysia().use(sessionPlugin({
    store: new CookieStore({
        cookieName: 'session'
    }),
    cookieName: 'session',
    expireAfter: 15 * 60, // 15 minutes
})).get('/', ({ session }) => {
    session.set('test', 'test')

    return session.get('test')
}).listen(3000)
```
