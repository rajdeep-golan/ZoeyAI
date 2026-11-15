import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const revalidate = 0;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let contact = "";
  try {
    const body = await request.json();
    contact = String(body?.contact ?? "").trim().slice(0, 200);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const digits = contact.replace(/[^\d]/g, "");
  const isEmail = EMAIL_RE.test(contact);
  const isPhone = !isEmail && /^[+\d\s().-]+$/.test(contact) && digits.length >= 7 && digits.length <= 15;
  if (!isEmail && !isPhone) {
    return NextResponse.json(
      { error: "Please enter a valid email address or phone number." },
      { status: 400 },
    );
  }

  const entry = {
    contact,
    type: isEmail ? "email" : "phone",
    city: "Seattle",
    createdAt: new Date().toISOString(),
  };
  console.log("[waitlist] signup", entry.type, entry.createdAt);

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await put(`waitlist/seattle/${id}.json`, JSON.stringify(entry), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } catch (e) {
    console.error("[waitlist] failed to store signup", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
