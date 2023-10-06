# Elysia Session

![badge](https://github.com/gaurishhs/elysia-session/actions/workflows/npm-publish.yml/badge.svg)

## Features

- Runs in Bun, Cloudflare Workers, and those supported by Elysia.
- Flash messages — data that is deleted once it's read (one-off error messages, etc.)
- Built-in Memory, Bun SQLite and Cookie stores. 

## Installation 

```bash
bun a elysia-session
```

## Documentation

There are 3 stores in-built in this package:

1. Memory Store
2. Cookie Store
3. Bun SQLite Store

You can implement your own store by implementing the `Store` interface as shown below:

```ts
import { Context } from "elysia";
import { Store } from "elysia-session/store";
import { SessionData } from "elysia-session/session";

export class MyCustomStore implements Store {
  constructor() {
    // ...
  }
  getSession(id?: string, ctx?: Context): SessionData | null | undefined | Promise<SessionData | null | undefined> {
    // ...
  }
  createSession(data: SessionData, id?: string, ctx?: Context): Promise<void> | void {
    // ...
  }
  persistSession(data: SessionData, id?: string, ctx?: Context): Promise<void> | void {
    // ...
  }
  deleteSession(id?: string, ctx?: Context): Promise<void> | void {
    // ...
  }
}
```

### Usage

#### Memory Store

```ts
import { sessionPlugin } from "elysia-session";
import { MemoryStore } from "elysia-session/stores/memory"
import Elysia from "elysia";

new Elysia()
  .use(sessionPlugin({
    cookieName: "session", // Optional
    store: new MemoryStore(),
    expireAfter: 15 * 60, // 15 minutes
  })).get("/", () => 'Hi').listen(3000);
```

#### Cookie Store

```ts
import { sessionPlugin } from "elysia-session";
import { CookieStore } from "elysia-session/stores/cookie"
import Elysia from "elysia";

new Elysia()
  .use(sessionPlugin({
    cookieName: "session", // Optional, defaults to "session"
    store: new CookieStore({
      cookieOptions: {
        httpOnly: true
      }, // Optional, defaults to {}
      cookieName: "session" // Optional, defaults to "session"
    }),
    expireAfter: 15 * 60, // 15 minutes
  })).get("/", () => 'Hi').listen(3000);
```

#### Bun SQLite Store

```ts
import { sessionPlugin } from "elysia-session";
import { BunSQLiteStore } from "elysia-session/stores/bun/sqlite"
import { Database } from "bun:sqlite";
import Elysia from "elysia";

const database = new Database(":memory:");
// 2nd argument is the table name
const store = new BunSQLiteStore(database, "sessions");

new Elysia()
  .use(sessionPlugin({
    cookieName: "session", // Optional, default is "session"
    store,
    expireAfter: 15 * 60, // 15 minutes
  })).get("/", () => 'Hi').listen(3000);
```

### Flash Messages

Flash messages are one-off messages that are deleted once they are read. They are useful for displaying error messages, etc.

```ts
import { sessionPlugin } from "elysia-session";
import { MemoryStore } from "elysia-session/stores/memory"
import Elysia from "elysia";

new Elysia()
  .use(sessionPlugin({
    cookieName: "session", // Optional
    store: new MemoryStore(),
    expireAfter: 15 * 60, // 15 minutes
  })).get("/", (ctx) => {
    ctx.session.flash("error", "Something went wrong!");
    return 'Hi';
  }).listen(3000);
```

## License

MIT

## Author

Copyright (c) 2023 Gaurish Sethia, All rights reserved.