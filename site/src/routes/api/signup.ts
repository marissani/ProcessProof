import { createFileRoute } from "@tanstack/react-router";

import { sql } from "~/db";

/**
 * Waitlist signup endpoint (MVP). Stores one row per accepted signup in the team's
 * shared Postgres database (`DATABASE_URL` via `~/db`), so a signup made on the
 * published site lands in the same place the team reads — and survives a redeploy.
 *
 * There is deliberately no local-file fallback: one storage path, or an honest
 * error. `{ ok: true }` is returned only after the row is committed; if storage is
 * unavailable the visitor gets a 503 and the client keeps the form on screen.
 */

const TYPES = ["professional", "company"] as const;
type SignupType = (typeof TYPES)[number];

const MAX_NOTE = 1000;
const MAX_SHORT = 200;

// Deliberately conservative: something@something.something, no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SAVE_FAILED =
  "We couldn't save that just now — please try again in a few minutes. If it keeps failing, email processproof-000e23ff@ctomail.io and we'll add you by hand. Nothing has been sent.";

type Fields = Record<string, unknown>;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function bad(message: string) {
  return json({ ok: false, error: message }, 400);
}

function unavailable() {
  return json({ ok: false, error: SAVE_FAILED }, 503);
}

/** Reads either a JSON body or a urlencoded form body. Throws on unreadable input. */
async function readBody(request: Request): Promise<Fields> {
  const raw = await request.text();
  if (!raw.trim()) throw new Error("The form was empty.");

  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw)) as Fields;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("We couldn't read the form data.");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("We couldn't read the form data.");
  }
  return parsed as Fields;
}

function shortString(fields: Fields, key: string, max = MAX_SHORT): string {
  const value = fields[key];
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

type NewSignup = {
  type: SignupType;
  name: string;
  email: string;
  years: string | null;
  specialty: string | null;
  company: string | null;
  role: string | null;
  note: string;
};

/**
 * There is no migration step in this deployment, so the handler makes sure the
 * table exists before it writes. `if not exists` keeps this idempotent.
 */
async function ensureTable(db: ReturnType<typeof sql>): Promise<void> {
  await db`
    create table if not exists signups (
      id serial primary key,
      created_at timestamptz not null default now(),
      type text not null,
      name text not null,
      email text not null,
      years text,
      specialty text,
      company text,
      role text,
      note text
    )
  `;
}

function insertRow(db: ReturnType<typeof sql>, row: NewSignup) {
  return db`
    insert into signups (type, name, email, years, specialty, company, role, note)
    values (
      ${row.type},
      ${row.name},
      ${row.email},
      ${row.years},
      ${row.specialty},
      ${row.company},
      ${row.role},
      ${row.note}
    )
  `;
}

/**
 * Two requests arriving in the first moments after a cold database can both run
 * `create table if not exists`, and one can lose that race with an "already exists"
 * error. Only that error is retried — anything else (bad credentials, network,
 * missing DATABASE_URL) propagates so the visitor gets an honest failure.
 */
function isCreateTableRace(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /already exists|duplicate key value violates unique constraint/i.test(message);
}

async function saveSignup(row: NewSignup): Promise<void> {
  // `sql()` throws when DATABASE_URL is not set — that surfaces as an honest 503.
  const db = sql();
  await ensureTable(db);
  try {
    await insertRow(db, row);
  } catch (err) {
    if (!isCreateTableRace(err)) throw err;
    await ensureTable(db);
    await insertRow(db, row);
  }
}

export const Route = createFileRoute("/api/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let fields: Fields;
        try {
          fields = await readBody(request);
        } catch (err) {
          return bad(err instanceof Error ? err.message : "We couldn't read the form data.");
        }

        const type = typeof fields.type === "string" ? fields.type.trim() : "";
        if (!TYPES.includes(type as SignupType)) {
          return bad('"type" must be either "professional" or "company".');
        }

        const name = shortString(fields, "name");
        if (!name) return bad("Your name is required.");

        const email = shortString(fields, "email", 320);
        if (!email) return bad("Your email is required.");
        if (!EMAIL_RE.test(email)) return bad("That doesn't look like a valid email address.");

        const rawNote = typeof fields.note === "string" ? fields.note : "";
        if (rawNote.length > MAX_NOTE) {
          return bad(`Please keep that answer under ${String(MAX_NOTE)} characters.`);
        }

        const signupType = type as SignupType;
        const row: NewSignup = {
          type: signupType,
          name,
          email,
          years: signupType === "professional" ? shortString(fields, "years") : null,
          specialty: signupType === "professional" ? shortString(fields, "specialty") : null,
          company: signupType === "company" ? shortString(fields, "company") : null,
          role: signupType === "company" ? shortString(fields, "role") : null,
          note: rawNote.trim(),
        };

        try {
          await saveSignup(row);
        } catch (err) {
          console.error("[signup] could not save signup to the database", err);
          return unavailable();
        }

        // Reached only after the insert committed.
        return json({ ok: true }, 200);
      },
    },
  },
});
