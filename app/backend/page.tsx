import { rankMatches, type Profile } from "@/lib/matching";
import { loadProfiles } from "@/lib/profilesDb";
import RefreshButton from "./RefreshButton";
import MemberList from "./MemberList";
import "./backend.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Zoey Backend · Profiles DB", robots: { index: false } };

type Props = { searchParams: { key?: string; profile?: string } };

const fmtHeight = (cm?: number | null) => {
  if (!cm) return "—";
  const inches = Math.round(cm / 2.54);
  return `${cm} cm (${Math.floor(inches / 12)}'${inches % 12}")`;
};

export default async function BackendPage({ searchParams }: Props) {
  const key = searchParams.key ?? "";
  if (!process.env.DASHBOARD_KEY || key !== process.env.DASHBOARD_KEY) {
    return <main className="be"><div className="be-locked">🔒 Not authorized</div></main>;
  }

  const all = await loadProfiles();
  const calls = all.filter((p) => p.source === "voice_call");
  const seeds = all.filter((p) => p.source === "seed").sort((a, b) => a.id.localeCompare(b.id));
  const pinned = all.find((p) => p.id === searchParams.profile);
  const following = !pinned; // no profile picked -> always show the newest call
  const selected = pinned ?? calls[0] ?? seeds[0];
  const newToday = calls.filter((p) => !!p.created_at && Date.now() - Date.parse(p.created_at) < 24 * 60 * 60 * 1000).length;
  const isNew = (p: Profile) => !!p.created_at && Date.now() - Date.parse(p.created_at) < 15 * 60 * 1000;
  const matches = selected ? rankMatches(selected, seeds, 5) : [];
  const link = (id: string) => `/backend?key=${encodeURIComponent(key)}&profile=${encodeURIComponent(id)}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { transcript, top_matches: _stored, ...profileFields } = selected ?? ({} as Profile);

  return (
    <main className="be">
      <header className="be-head">
        <div>
          <div className="be-logo">ZOEY <span>backend</span></div>
          <div className="be-sub">Database · collection <code>profiles</code></div>
        </div>
        <div className="be-live">
          {following ? (
            <><span className="pulse" /> Showing latest call <RefreshButton /></>
          ) : (
            <a href={`/backend?key=${encodeURIComponent(key)}`}>● Follow latest call</a>
          )}
        </div>
        <div className="be-stats">
          <div><b>{all.length}</b><span>profiles</span></div>
          <div><b>{all.length}</b><span>added via calls</span></div>
          <div><b>{newToday}</b><span>new today</span></div>
        </div>
      </header>

      <div className="be-grid">
        <aside className="be-list">
          <h3>Latest calls</h3>
          {calls.length === 0 && <p className="be-muted">No calls yet. Talk to Zoey and hang up — the profile appears here.</p>}
          {calls.map((p) => (
            <a key={p.id} href={link(p.id)} className={`be-item ${p.id === selected?.id ? "on" : ""}`}>
              <span className="be-dot call" />
              <span>
                <b>{p.name ?? "Unknown caller"} {isNew(p) && <em className="be-new">NEW</em>}</b>
                <small>{p.created_at ? new Date(p.created_at).toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " PT" : ""}</small>
              </span>
            </a>
          ))}
          <MemberList
            keyParam={key}
            selectedId={selected?.id}
            members={seeds.map((p) => ({ id: p.id, name: p.name ?? p.id, age: p.age ?? null, gender: p.gender ?? null, city: p.current_city ?? null }))}
          />
        </aside>

        {selected && (
          <section className="be-main">
            <div className="be-card">
              <div className="be-card-head">
                <div>
                  <span className={`be-tag ${selected.source === "voice_call" ? "call" : ""}`}>
                    {selected.source === "voice_call" ? "🎙️ live call · just captured" : "🎙️ profile created via Zoey call"}
                  </span>
                  <h2>{selected.name ?? "Unknown caller"}</h2>
                  <p className="be-muted">{selected.summary}</p>
                </div>
              </div>
              <div className="be-facts">
                <div><span>Age</span>{selected.age ?? "—"}</div>
                <div><span>Gender</span>{selected.gender ?? "—"}</div>
                <div><span>Looking for</span>{selected.looking_for ?? "—"}</div>
                <div><span>Hometown</span>{selected.hometown ?? "—"}</div>
                <div><span>Lives in</span>{selected.current_city ?? "—"}</div>
                <div><span>Dream city</span>{selected.dream_city ?? "—"}</div>
                <div><span>Height</span>{fmtHeight(selected.height_cm)}</div>
                <div><span>Occupation</span>{selected.occupation ?? "—"}</div>
                <div><span>Goal</span>{selected.relationship_goal ?? "—"}</div>
                <div><span>Personality</span>{selected.personality ?? "—"}</div>
              </div>
              <div className="be-chips">
                {(selected.interests ?? []).map((t) => <span key={t} className="chip">♥ {t}</span>)}
                {(selected.values ?? []).map((t) => <span key={t} className="chip v">★ {t}</span>)}
                {(selected.dislikes ?? []).map((t) => <span key={t} className="chip x">✕ {t}</span>)}
              </div>
            </div>

            <div className="be-card">
              <h3>Top soul matches for {selected.name ?? "this caller"}</h3>
              {matches.length === 0 && <p className="be-muted">No compatible members found.</p>}
              {matches.map((m, i) => (
                <details key={m.id} className="be-match" open={i === 0}>
                  <summary>
                    <span className="rank">#{i + 1}</span>
                    <span className="mname">{m.name}</span>
                    <span className="bar"><i style={{ width: `${m.score}%` }} /></span>
                    <span className="pct">{m.score}%</span>
                  </summary>
                  <table>
                    <tbody>
                      {m.breakdown.map((b) => (
                        <tr key={b.factor}>
                          <td>{b.factor}</td>
                          <td className="num">{b.points}/{b.max}</td>
                          <td className="be-muted">{b.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              ))}
            </div>

            {transcript && transcript.length > 0 && (
              <details className="be-card">
                <summary><h3 style={{ display: "inline" }}>Call transcript ({transcript.length} turns)</h3></summary>
                <div className="be-transcript">
                  {transcript.map((t, i) => (
                    <p key={i} className={t.role}><b>{t.role === "user" ? "User" : "Zoey"}:</b> {t.text}</p>
                  ))}
                </div>
              </details>
            )}

            <details className="be-card" open>
              <summary><h3 style={{ display: "inline" }}>Raw DB document · profiles/{selected.id}.json</h3></summary>
              <pre className="be-json">{JSON.stringify({ ...profileFields, top_matches: matches.map((m) => ({ id: m.id, name: m.name, score: m.score })), transcript: transcript ? `[${transcript.length} turns]` : undefined }, null, 2)}</pre>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
