import { list, put } from "@vercel/blob";
import type { Profile } from "./matching";

const PREFIX = "profiles/";
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

export async function loadProfiles(): Promise<Profile[]> {
  const blobs: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: PREFIX, cursor, token: token() });
    blobs.push(...res.blobs);
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);

  const docs = await Promise.all(
    blobs.map(async (b) => {
      const r = await fetch(b.url, { headers: { Authorization: `Bearer ${token()}` }, cache: "no-store" });
      return r.ok ? ((await r.json()) as Profile) : null;
    }),
  );
  // Bulk-imported members live in one bundle document (fast to load).
  const bundles: Profile[] = [];
  const mb = await list({ prefix: "members/", token: token() });
  for (const b of mb.blobs) {
    const r = await fetch(b.url, { headers: { Authorization: `Bearer ${token()}` }, cache: "no-store" });
    if (r.ok) bundles.push(...((await r.json()) as Profile[]));
  }
  return [...docs, ...bundles]
    .filter((d): d is Profile => !!d && !!d.id)
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
}

export async function saveProfile(p: Profile) {
  await put(`${PREFIX}${p.id}.json`, JSON.stringify(p, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: token(),
  });
}
