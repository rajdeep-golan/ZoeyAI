"use client";

import { FormEvent, useState } from "react";

export default function SeattleInvite() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    if (status === "done") {
      setStatus("idle");
      setContact("");
    }
    setError("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <button type="button" className="invite-cta" onClick={() => setOpen(true)}>
        <span className="invite-cta-badge">NEW</span>
        ✨ Sign Up for Exclusive Seattle Invite ✨
      </button>

      {open && (
        <div className="invite-overlay" onClick={close} role="dialog" aria-modal="true">
          <div className="invite-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="invite-close" onClick={close} aria-label="Close">
              ×
            </button>
            {status === "done" ? (
              <div className="invite-success">
                <div className="invite-emoji">💜</div>
                <h3>You&apos;re on the list!</h3>
                <p>
                  We&apos;re so excited to have you join the waitlist. We&apos;ll let you know as
                  soon as ZOEY goes live in Seattle.
                </p>
                <button type="button" className="btn" onClick={close}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3>Exclusive Invite — Seattle</h3>
                <p>Be the first to meet ZOEY in Seattle. Enter your email or phone number.</p>
                <input
                  className="invite-input"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com or (206) 555-0123"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  autoFocus
                />
                {error && <div className="invite-error">{error}</div>}
                <button type="submit" className="btn invite-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Joining..." : "Join the Waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
