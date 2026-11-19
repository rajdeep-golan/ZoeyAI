import { list } from "@vercel/blob";

export type WaitlistEntry = { id: string; contact: string; type: string; city: string; createdAt: string };

const PREFIX = "waitlist/";
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

async function listAll() {
  const blobs: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: PREFIX, cursor, token: token() });
    blobs.push(...res.blobs);
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return blobs;
}

// Cheap: one list call, no downloads. Used for the tab badge.
export async function countWaitlist(): Promise<number> {
  return (await listAll()).length;
}

export async function loadWaitlist(): Promise<WaitlistEntry[]> {
  const blobs = await listAll();
  const docs = await Promise.all(
    blobs.map(async (b) => {
      const r = await fetch(b.url, { headers: { Authorization: `Bearer ${token()}` }, cache: "no-store" });
      if (!r.ok) return null;
      const d = await r.json();
      return { id: b.pathname, ...d } as WaitlistEntry;
    }),
  );
  return docs
    .filter((d): d is WaitlistEntry => !!d)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}
