import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { updateMomentNote } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (typeof b.artworkId !== "string" || !Number.isInteger(b.index) || b.index < 0) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const note = typeof b.note === "string" ? b.note : "";
  const userId = await getUserId();
  try {
    await updateMomentNote(userId, b.artworkId, b.index, note);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
