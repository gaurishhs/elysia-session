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