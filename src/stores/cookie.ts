import { CookieOptions } from "elysia";
import { Context } from "elysia";
import { Store } from "../store"
import { SessionData } from "../session";

interface CookieStoreOptions {
    cookieOptions?: CookieOptions;
    cookieName?: string;
}

export class CookieStore implements Store {
    private options: CookieStoreOptions;
    constructor(options?: CookieStoreOptions) {
        this.options = options || {
            cookieName: 'session'
        }
    }

    getSession(id?: string | undefined, ctx?: Context) {
        const cookie = ctx?.cookie[this.options.cookieName!];
        let result: SessionData | null = null;
        try {
            result = JSON.parse(cookie?.value ?? "") as SessionData
        } catch {}
        return result;
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