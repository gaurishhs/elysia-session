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

## Community Stores

<details>
  <summary>Mongoose (@macnak)</summary>
  
```ts
import { Context } from "elysia";
import { SessionData } from "elysia-session/session";
import { Store } from "elysia-session/store";
import * as mongoose from 'mongoose';



export interface ISession extends mongoose.Document {
  _id: string;
  sessionData: SessionData;
}

export class MongooseStore implements Store {
  private db: typeof import('mongoose');
  private collection: string;
  private schema: mongoose.Schema | null;
  private model: mongoose.Model<ISession> | null;

  constructor(db: typeof import('mongoose'), collection: string) {
    this.db = db;
    this.collection = collection;
    this.schema = new mongoose.Schema({
      _id: String,
      sessionData: { type: JSON },
    })
    this.model = mongoose.model<ISession>(collection, this.schema);
  }

  getSession (id?: string | undefined, ctx?: Context): SessionData | Promise<SessionData | null | undefined> | null | undefined {
    if (!id) return null;
    if (this.model) {
      this.model.findOne({ _id: id }, (err: Error, session: ISession) => {
        if (err || !session) return null;
        return session.sessionData
      })
    } else
      return null
  }

  createSession (data: SessionData, id: string, ctx?: Context): void | Promise<void> {
    console.log("createSession")
    if (this.model) {
      const session = new this.model({
        _id: id,
        sessionData: data,
      })
      session.save();
    }
  }

  deleteSession (id?: string | undefined, ctx?: Context): void | Promise<void> {
    if (!id) return;
    console.log("deleteSession")
    if (this.model) {
      this.model.deleteOne({ _id: id })
    }
  }

  persistSession (data: SessionData, id?: string, ctx?: Context): Promise<void> | void {
    if (!id) return;
    console.log("persistSession")
    if (this.model) {
      this.model.updateOne({ _id: id }, { sessionData: data })
    }
  }
}
```

</details>

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
