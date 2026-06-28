import { NextResponse } from "next/server";

// One-click demo entry for judges: visiting /demo sets the anonymous id cookie to the
// pre-seeded `demo-hero` account and redirects home, so the rich collection (7-city map,
// exhibition history, reunion timelines) shows immediately — no DevTools cookie editing.
// Normal visitors are unaffected; only those who open this link become demo-hero.
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("artdex_uid", "demo-hero", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
