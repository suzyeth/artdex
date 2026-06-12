import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { presignedPutUrl } from "@/lib/aws/s3";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { contentType } = await req.json().catch(() => ({}));
  const ct =
    typeof contentType === "string" && contentType.startsWith("image/")
      ? contentType
      : "image/jpeg";
  const userId = await getUserId();
  const ext = ct.split("/")[1] || "jpg";
  const key = `selfies/${userId}/${randomUUID()}.${ext}`;
  const uploadUrl = await presignedPutUrl(key, ct);
  return NextResponse.json({ uploadUrl, key });
}
