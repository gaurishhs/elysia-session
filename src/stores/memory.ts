import { Store } from "../store";
import { SessionData } from "../session";

export class MemoryStore implements Store {
    private sessions: Map<string, SessionData>;

    constructor() {
        this.sessions = new Map();
    }

    getSession(id: string) {
        return this.sessions.has(id) ? this.sessions.get(id) : null;
    }

    createSession(data: SessionData, id: string): void | Promise<void> {
        this.sessions.set(id, data);
    }

    deleteSession(id: string): void | Promise<void> {
        this.sessions.delete(id);
    }

    persistSession(data: SessionData, id: string): void | Promise<void> {
        this.sessions.set(id, data);
    }
}