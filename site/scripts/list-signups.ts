/**
 * Read the signups the site has collected.
 *
 *   bun run scripts/list-signups.ts
 *
 * Prints the total row count and the 20 most recent signups, newest first. Reads
 * the same shared Postgres database the live site writes to (`DATABASE_URL`).
 * Read-only: it never inserts, updates or deletes anything. There is no web page
 * that exposes signups — this script is the way the team reads them.
 */
import { sql } from "../src/db";

const LIMIT = 20;

type Row = {
  id: number;
  created_at: Date | string;
  type: string;
  name: string;
  email: string;
  years: string | null;
  specialty: string | null;
  company: string | null;
  role: string | null;
  note: string | null;
};

function field(label: string, value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (!text.trim()) return "";
  return `${label}: ${text}`;
}

function printRow(row: Row): void {
  const parts = [
    field("Years", row.years),
    field("Specialty", row.specialty),
    field("Company", row.company),
    field("Role", row.role),
    field("Note", row.note),
  ].filter(Boolean);

  const when = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);

  console.log(`#${row.id}  ${when}  [${row.type}]`);
  console.log(`  name:  ${row.name}`);
  console.log(`  email: ${row.email}`);
  for (const part of parts) console.log(`  ${part}`);
  console.log("");
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is not set in this shell, so the signups table can't be read.\n" +
        "The owner connects the database (database card); it then arrives as DATABASE_URL.",
    );
    process.exit(1);
  }

  const db = sql();

  const existing = (await db`select to_regclass('public.signups') as table_name`) as Array<{
    table_name: string | null;
  }>;
  if (!existing[0]?.table_name) {
    console.log("No signups yet — the signups table has not been created.");
    console.log("It is created by the first signup that reaches the site's API.");
    return;
  }

  const counted = (await db`select count(*)::int as count from signups`) as Array<{ count: number }>;
  const total = counted[0]?.count ?? 0;

  console.log(`${total} signup${total === 1 ? "" : "s"} in total.`);

  if (total === 0) {
    console.log("No signups yet.");
    return;
  }

  const rows = (await db`
    select id, created_at, type, name, email, years, specialty, company, role, note
    from signups
    order by created_at desc, id desc
    limit ${LIMIT}
  `) as Row[];

  console.log(`Latest ${rows.length} (newest first):\n`);
  for (const row of rows) printRow(row);
}

main().catch((err: unknown) => {
  console.error("Could not read signups:", err instanceof Error ? err.message : err);
  process.exit(1);
});
