import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const normalized = String(code ?? "").trim().toUpperCase();

  if (!normalized) {
    return NextResponse.json({ valid: false, reason: "empty" }, { status: 400 });
  }

  const roster = await prisma.rosterCode.findUnique({ where: { code: normalized } });

  if (!roster) {
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 404 });
  }
  if (roster.done) {
    return NextResponse.json({ valid: false, reason: "already_done" }, { status: 409 });
  }

  return NextResponse.json({ valid: true, code: roster.code });
}
