import { SessionData } from "./session";
import { Context } from "elysia";

export interface Store {
    getSession(id?: string, ctx?: Context): SessionData | null | undefined | Promise<SessionData | null | undefined>
    createSession(data: SessionData, id?: string, ctx?: Context): Promise<void> | void
    persistSession(data: SessionData, id?: string, ctx?: Context): Promise<void> | void
    deleteSession(id?: string, ctx?: Context): Promise<void> | void
}