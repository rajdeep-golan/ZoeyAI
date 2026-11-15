// Zoey compatibility engine: explainable, weighted score (0-100) between two profiles.

export type Profile = {
  id: string;
  source?: string;
  created_at?: string;
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  looking_for?: string | null;
  hometown?: string | null;
  current_city?: string | null;
  dream_city?: string | null;
  height_cm?: number | null;
  occupation?: string | null;
  interests?: string[];
  likes_raw?: string[];
  dislikes?: string[];
  dislikes_raw?: string[];
  values?: string[];
  relationship_goal?: string | null;
  personality?: string | null;
  summary?: string | null;
  transcript?: { role: string; text: string }[];
  top_matches?: MatchResult[];
  [key: string]: unknown;
};

export type MatchResult = {
  id: string;
  name: string;
  score: number;
  compatible: boolean;
  breakdown: { factor: string; points: number; max: number; note: string; unknown?: boolean }[];
};

const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
const overlap = (a: string[] = [], b: string[] = []) => {
  const B = new Set(b);
  return a.filter((x) => B.has(x));
};

function wants(seeker: Profile, other: Profile) {
  const lf = norm(seeker.looking_for);
  const g = norm(other.gender);
  if (!lf || lf === "any" || !g) return true;
  return lf === g;
}

export function matchProfiles(a: Profile, b: Profile): MatchResult {
  const breakdown: MatchResult["breakdown"] = [];
  const compatible = wants(a, b) && wants(b, a);

  // Shared interests (30)
  const si = overlap(a.interests, b.interests);
  const denomI = Math.max(1, Math.min(a.interests?.length ?? 0, b.interests?.length ?? 0) || 1);
  const pi = Math.round(30 * Math.min(1, si.length / Math.min(denomI, 4)));
  breakdown.push({ factor: "Shared interests", points: pi, max: 30, note: si.length ? si.join(", ") : "none in common", unknown: !a.interests?.length });

  // Core values (20)
  const sv = overlap(a.values, b.values);
  const denomV = Math.max(1, Math.min(a.values?.length ?? 0, b.values?.length ?? 0) || 1);
  const pv = Math.round(20 * Math.min(1, sv.length / Math.min(denomV, 3)));
  breakdown.push({ factor: "Core values", points: pv, max: 20, note: sv.length ? sv.join(", ") : "different priorities", unknown: !a.values?.length });

  // Relationship goal (15)
  const ga = norm(a.relationship_goal), gb = norm(b.relationship_goal);
  let pg = 8, ng = "unknown";
  if (ga && gb) {
    const serious = (g: string) => g === "long-term" || g === "marriage";
    if (ga === gb) { pg = 15; ng = `both want ${ga}`; }
    else if (serious(ga) && serious(gb)) { pg = 11; ng = `${ga} / ${gb}`; }
    else if (ga === "not sure" || gb === "not sure") { pg = 7; ng = `${ga} / ${gb}`; }
    else { pg = 2; ng = `${ga} vs ${gb}`; }
  }
  breakdown.push({ factor: "Relationship goal", points: pg, max: 15, note: ng, unknown: !ga });

  // Age (10)
  let pa = 5, na = "unknown";
  if (a.age && b.age) {
    const d = Math.abs(a.age - b.age);
    pa = d <= 2 ? 10 : d <= 5 ? 8 : d <= 8 ? 5 : d <= 12 ? 2 : 0;
    na = `${d} yr difference`;
  }
  breakdown.push({ factor: "Age", points: pa, max: 10, note: na, unknown: !a.age });

  // Location & dreams (10)
  let pl = 0; const nl: string[] = [];
  const ca = norm(a.current_city || a.hometown), cb = norm(b.current_city || b.hometown);
  const seattleArea = ["seattle", "bellevue", "redmond", "tacoma", "kirkland"];
  if (ca && cb && ca === cb) { pl += 7; nl.push(`both in ${a.current_city}`); }
  else if (seattleArea.includes(ca) && seattleArea.includes(cb)) { pl += 5; nl.push("both in Seattle area"); }
  else if (!ca || !cb) { pl += 3; }
  const da = norm(a.dream_city), db = norm(b.dream_city);
  if (da && db && da === db) { pl += 3; nl.push(`same dream city: ${a.dream_city}`); }
  breakdown.push({ factor: "Location & dreams", points: Math.min(10, pl), max: 10, note: nl.join("; ") || "different places", unknown: !ca && !da });

  // Personality (5)
  const pa1 = norm(a.personality), pb1 = norm(b.personality);
  let pp = 3, np = "unknown";
  if (pa1 && pb1) {
    pp = pa1 === "ambivert" || pb1 === "ambivert" ? 5 : pa1 === pb1 ? 4 : 3;
    np = `${pa1} + ${pb1}`;
  }
  breakdown.push({ factor: "Personality", points: pp, max: 5, note: np, unknown: !pa1 });

  // Deal-breakers (10): one person's interests in the other's dislikes
  const c1 = overlap(a.interests, b.dislikes), c2 = overlap(b.interests, a.dislikes);
  const conflicts = [...c1, ...c2];
  const pd = Math.max(0, 10 - 5 * conflicts.length);
  breakdown.push({ factor: "No deal-breakers", points: pd, max: 10, note: conflicts.length ? `conflict: ${conflicts.join(", ")}` : "none found", unknown: !a.interests?.length && !a.dislikes?.length });

  // Factors the caller hasn't shared yet are scored as neutral (60% of the factor), not as zero.
  breakdown.forEach((x) => {
    if (x.unknown) { x.points = Math.round(0.6 * x.max); x.note = "not shared yet · neutral"; }
  });
  let score = breakdown.reduce((s, x) => s + x.points, 0);
  if (!compatible) score = Math.min(score, 15);
  return { id: b.id, name: b.name ?? b.id, score, compatible, breakdown };
}

export function rankMatches(user: Profile, pool: Profile[], limit = 5): MatchResult[] {
  return pool
    .filter((p) => p.id !== user.id)
    .map((p) => matchProfiles(user, p))
    .filter((m) => m.compatible)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit);
}
