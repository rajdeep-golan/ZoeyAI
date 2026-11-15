"use client";

import { useMemo, useState } from "react";

type M = { id: string; name: string; age: number | null; gender: string | null; city: string | null };

export default function MemberList({ members, keyParam, selectedId }: { members: M[]; keyParam: string; selectedId?: string }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? members.filter((m) => `${m.name} ${m.city ?? ""} ${m.gender ?? ""}`.toLowerCase().includes(s)) : members;
    return list.slice(0, 400);
  }, [q, members]);
  return (
    <>
      <h3>All members ({members.length})</h3>
      <input className="be-search" placeholder="Search name or city…" value={q} onChange={(e) => setQ(e.target.value)} />
      {shown.map((p) => (
        <a key={p.id} href={`/backend?key=${encodeURIComponent(keyParam)}&profile=${encodeURIComponent(p.id)}`} className={`be-item ${p.id === selectedId ? "on" : ""}`}>
          <span className="be-dot" />
          <span>
            <b>{p.name}</b>
            <small>{p.age} · {p.gender} · {p.city}</small>
          </span>
        </a>
      ))}
    </>
  );
}
