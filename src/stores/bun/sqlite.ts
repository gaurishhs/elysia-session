import { Store } from "../../store";
import { SessionData } from "../../session";
import { Database } from "bun:sqlite";
import { Cookie } from "elysia";
import { Context } from "elysia";

export class BunSQLiteStore implements Store {
  private db: Database;
  private tableName: string;

  constructor(db: Database, tableName: string) {
    this.db = db;
    this.tableName = tableName;
    this.db
      .query(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (id TEXT PRIMARY KEY, data TEXT)`
      )
      .run();
  }

  async getSession(
    id?: string | undefined,
    ctx?: Context
  ): Promise<any> { // SessionData | Promise<SessionData | null | undefined> | null | undefined {
    if (!id) return null;
    const query = this.db.query(
      `SELECT data FROM ${this.tableName} WHERE id = $id`
    );
    const result = await query.get({ $id: id });
    if (!result) return null;
    // @ts-expect-error - data property is not defined in type
    return JSON.parse(result.data) as SessionData;
  }

  async createSession(
    data: SessionData,
    id: string,
    ctx?: Context
  ): Promise<any> { // void | Promise<void> {
    let query
    try {
      query = this.db.query(
        `INSERT INTO ${this.tableName} (id, data) VALUES ($id, $data)`
      );
      await query.run({ $id: id, $data: JSON.stringify(data) });
    } catch (e) {
      query = this.db.query(
        `UPDATE ${this.tableName} SET data = $data WHERE id = $id`
      );
      await query.run({ $id: id, $data: JSON.stringify(data) });
    }
  }

  async deleteSession(id?: string | undefined, ctx?: Context): Promise<any> { // void || Promise<void> {
    if (!id) return;
    const query = this.db.query(`DELETE FROM ${this.tableName} WHERE id = $id`);
    await query.run({ $id: id });
  }

  async persistSession(
    data: SessionData,
    id?: string | undefined,
    ctx?:
      | {
          body: unknown;
          query: Record<string, string | null>;
          params: never;
          headers: Record<string, string | null>;
          cookie: Record<string, Cookie<any>>;
          set: {
            headers: Record<string, string> & {
              "Set-Cookie"?: string | string[] | undefined;
            };
            status?:
              | number
              | "Continue"
              | "Switching Protocols"
              | "Processing"
              | "Early Hints"
              | "OK"
              | "Created"
              | "Accepted"
              | "Non-Authoritative Information"
              | "No Content"
              | "Reset Content"
              | "Partial Content"
              | "Multi-Status"
              | "Already Reported"
              | "Multiple Choices"
              | "Moved Permanently"
              | "Found"
              | "See Other"
              | "Not Modified"
              | "Temporary Redirect"
              | "Permanent Redirect"
              | "Bad Request"
              | "Unauthorized"
              | "Payment Required"
              | "Forbidden"
              | "Not Found"
              | "Method Not Allowed"
              | "Not Acceptable"
              | "Proxy Authentication Required"
              | "Request Timeout"
              | "Conflict"
              | "Gone"
              | "Length Required"
              | "Precondition Failed"
              | "Payload Too Large"
              | "URI Too Long"
              | "Unsupported Media Type"
              | "Range Not Satisfiable"
              | "Expectation Failed"
              | "I'm a teapot"
              | "Misdirected Request"
              | "Unprocessable Content"
              | "Locked"
              | "Failed Dependency"
              | "Too Early"
              | "Upgrade Required"
              | "Precondition Required"
              | "Too Many Requests"
              | "Request Header Fields Too Large"
              | "Unavailable For Legal Reasons"
              | "Internal Server Error"
              | "Not Implemented"
              | "Bad Gateway"
              | "Service Unavailable"
              | "Gateway Timeout"
              | "HTTP Version Not Supported"
              | "Variant Also Negotiates"
              | "Insufficient Storage"
              | "Loop Detected"
              | "Not Extended"
              | "Network Authentication Required"
              | undefined;
            redirect?: string | undefined;
            cookie?:
              | Record<
                  string,
                  {
                    value: string;
                    domain?: string | undefined;
                    expires?: Date | undefined;
                    httpOnly?: boolean | undefined;
                    maxAge?: number | undefined;
                    path?: string | undefined;
                    priority?: "low" | "medium" | "high" | undefined;
                    sameSite?: boolean | "lax" | "strict" | "none" | undefined;
                    secure?: boolean | undefined;
                    secrets?: string | string[] | undefined;
                  }
                >
              | undefined;
          };
          path: string;
          request: Request;
          store: {};
        }
      | undefined
  ): Promise<any> { // void | Promise<void> {
    if (!id) return;
    const query = this.db.query(
      `UPDATE ${this.tableName} SET data = $data WHERE id = $id`
    );
    await query.run({ $id: id, $data: JSON.stringify(data) });
  }
}
