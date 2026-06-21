import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  sustainabilityGoal: z.string().min(3),
  preferredTransport: z.string().min(2)
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  await prisma.user.update({ where: { id: session.user.id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}
