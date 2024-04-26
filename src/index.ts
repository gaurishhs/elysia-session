import type Elysia from "elysia";
import { Store } from "./store";
import { Session, SessionData } from "./session";
import { nanoid } from "nanoid";
import { CookieStore } from "./stores/cookie";
import { CookieOptions } from "elysia/dist/cookie";

export interface SessionOptions {
  store: Store;
  expireAfter: number;
  cookieName?: string;
  cookieOptions?: CookieOptions;
}

export const sessionPlugin = (options: SessionOptions) => (app: Elysia) => {
  return app
    .derive(async (ctx) => {
      const store = options.store;
      const session = new Session();
      const cookieName = options.cookieName || "session";
      const cookie = ctx.cookie[cookieName];
      let sid: string = "";
      let sessionData: SessionData | null | undefined;
      let createRequired = false;

      if (cookie) {
        sid = cookie.value
        try {
          sessionData = await store.getSession(sid, ctx);
        } catch {
          createRequired = true;
        }

        if (sessionData) {
          session.setCache(sessionData);

          if (session.valid()) {
            session.reUpdate(options.expireAfter);
          } else {
            await store.deleteSession(sid, ctx);
            cookie.remove();
            createRequired = true;
          }
        } else {
          createRequired = true;
        }
      } else {
        createRequired = true;
      }

      if (createRequired) {
        const initialData = {
          _data: {},
          _expire: null,
          _delete: false,
          _accessed: null,
        };
        sid = cookie.value || nanoid(24);
        await store.createSession(initialData, sid, ctx);
        session.setCache(initialData);
      }

      if (!(store instanceof CookieStore)) {
        ctx.cookie[cookieName].set({
          value: sid,
          ...options.cookieOptions,
        });
      }
      sid = cookie.value
      await store.persistSession(session.getCache(), sid, ctx);

      if (session.getCache()._delete) {
        await store.deleteSession(sid, ctx);
        cookie.remove()
      }

      return {
        session,
      };
    })
    .onResponse(async (ctx) => {
      const store = options.store;
      const session = ctx.session;
      const cookieName = options.cookieName || "session";
      const cookie = ctx.cookie[cookieName];
      let sid = "";
      let sessionData;
      let createRequired = false;
      if (cookie) {
        sid = cookie.value
        session.reUpdate(options.expireAfter);
        await store.persistSession(session.getCache(), sid, ctx);
      }
    });
};
