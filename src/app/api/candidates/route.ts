import { NextRequest, NextResponse } from "next/server";
import { currentCandidates } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const museumId = req.nextUrl.searchParams.get("museumId");
  if (!museumId) {
    return NextResponse.json({ error: "museumId required" }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  const candidates = await currentCandidates(museumId, today);
  return NextResponse.json({ candidates });
}
