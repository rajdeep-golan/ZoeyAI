"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

// Manual refresh only: each refresh reads the Blob DB, so we never poll on a timer.
export default function RefreshButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button className="refresh-btn" disabled={pending} onClick={() => start(() => router.refresh())}>
      {pending ? "Refreshing…" : "↻ Refresh"}
    </button>
  );
}
