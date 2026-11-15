import { rankMatches, type Profile } from "@/lib/matching";
import { loadProfiles, saveProfile } from "@/lib/profilesDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Called by the Zoey voice agent at the end of a call.
export async function POST(request: Request) {
  if (!process.env.INGEST_SECRET || request.headers.get("x-ingest-secret") !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let doc: Profile;
  try {
    doc = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!doc?.id || !/^[\w-]{3,80}$/.test(doc.id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const all = await loadProfiles();
  const pool = all.filter((p) => p.source === "seed");

  // Keep display names unique across the DB: "Rahul" -> "Rahul 2", "Rahul 3", ...
  const base = (doc.name ?? "").trim() || "Guest";
  const taken = new Set(all.filter((p) => p.id !== doc.id).map((p) => (p.name ?? "").trim().toLowerCase()));
  let name = base;
  for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${base} ${n}`;
  if (name !== doc.name) doc.spoken_name = doc.name ?? null;
  doc.name = name;

  doc.top_matches = rankMatches(doc, pool, 5);
  await saveProfile(doc);
  return NextResponse.json({ ok: true, id: doc.id, top_matches: doc.top_matches.map((m) => ({ name: m.name, score: m.score })) });
}
