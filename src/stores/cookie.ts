import { Cookie, CookieOptions } from "elysia/dist/cookie";
import { Context } from "elysia";
import { Store } from "../store"
import { SessionData } from "../session";

interface CookieStoreOptions {
    cookieOptions?: CookieOptions;
    cookieName?: string;
}

export class CookieStore implements Store {
    constructor(private options: CookieStoreOptions) {
        if (!options.cookieName) options.cookieName = 'session';
    }

    getSession(id?: string | undefined, ctx?: Context) {
        const cookie = ctx?.cookie[this.options.cookieName!];
        return cookie ? JSON.parse(cookie.value) as SessionData : null;
    }

    createSession(data: SessionData, id: string, ctx?: Context): void | Promise<void> { 
        ctx?.cookie[this.options.cookieName!].set({
            value: JSON.stringify(data),
            ...this.options.cookieOptions
        })
    }

    deleteSession(id: string, ctx?: Context): void | Promise<void> {
        delete ctx?.cookie[this.options.cookieName!]
    }

    persistSession(data: SessionData, id: string, ctx?: Context): void | Promise<void> {
        ctx?.cookie[this.options.cookieName!].set({
            value: JSON.stringify(data),
            ...this.options.cookieOptions
        })
    }
}