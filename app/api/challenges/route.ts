import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const completionSchema = z.object({ challengeId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = completionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid challenge" }, { status: 400 });

  const challenge = await prisma.challenge.findUnique({ where: { id: parsed.data.challengeId } });
  if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

  try {
    await prisma.$transaction([
      prisma.challengeCompletion.create({ data: { userId: session.user.id, challengeId: challenge.id } }),
      prisma.badge.upsert({
        where: { userId_name: { userId: session.user.id, name: challenge.badgeName } },
        create: { userId: session.user.id, name: challenge.badgeName, icon: "Award" },
        update: {}
      }),
      prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: challenge.points } } })
    ]);
  } catch {
    return NextResponse.json({ error: "Challenge already completed" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
