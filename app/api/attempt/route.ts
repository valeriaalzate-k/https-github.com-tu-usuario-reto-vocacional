import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CAREERS } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { code, topCareerId } = await req.json();
  const normalized = String(code ?? "").trim().toUpperCase();

  if (!normalized || !CAREERS.some((c) => c.id === topCareerId)) {
    return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
  }

  const roster = await prisma.rosterCode.findUnique({ where: { code: normalized } });
  if (!roster) {
    return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
  }
  if (roster.done) {
    return NextResponse.json({ ok: true, alreadyDone: true });
  }

  await prisma.rosterCode.update({
    where: { code: normalized },
    data: { done: true, completedAt: new Date(), topCareerId },
  });

  return NextResponse.json({ ok: true });
}
