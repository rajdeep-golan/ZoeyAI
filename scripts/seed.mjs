// One-off: upload data/seed-profiles.json into the Blob "profiles" collection.
import { put } from "@vercel/blob";
import { readFileSync } from "node:fs";
const seeds = JSON.parse(readFileSync(new URL("../data/seed-profiles.json", import.meta.url)));
const now = new Date().toISOString();
for (const s of seeds) {
  const doc = { ...s, source: "seed", created_at: s.created_at ?? now };
  await put(`profiles/${s.id}.json`, JSON.stringify(doc, null, 2), {
    access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true,
  });
  console.log("seeded", s.id, s.name);
}
