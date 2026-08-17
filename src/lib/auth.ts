// Per-browser anonymous user id, backed by an httpOnly cookie.
// This is the seam where Clerk plugs in later: replace getUserId() with the
// Clerk session user id and everything downstream (collections) keeps working.
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE = "artdex_uid";

/** Read the caller's user id, minting + setting one on first visit. */
export async function getUserId(): Promise<string> {
  // Local demo override: when DEMO_USER_ID is set (e.g. in .env.local) outside
  // production, every request acts as that pre-seeded user — so `npm run dev`
  // can showcase the demo-hero account (rich map + moment timeline) with no
  // cookie fiddling. Guarded off in production to avoid a shared-account footgun.
  const demo = process.env.DEMO_USER_ID;
  if (demo && process.env.NODE_ENV !== "production") return demo;

  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing) return existing;
  const uid = randomUUID();
  jar.set(COOKIE, uid, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return uid;
}
