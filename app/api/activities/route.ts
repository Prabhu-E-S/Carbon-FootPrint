import { ActivityCategory } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { calculateEmission, carbonFactors } from "@/lib/carbon";
import { prisma } from "@/lib/prisma";

const activitySchema = z.object({
  category: z.nativeEnum(ActivityCategory),
  type: z.string().min(2),
  amount: z.coerce.number().positive(),
  unit: z.string().min(1),
  notes: z.string().optional()
});

const activityUpdateSchema = activitySchema.extend({
  id: z.string().min(1)
});

const activityDeleteSchema = z.object({
  id: z.string().min(1)
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const activities = await prisma.activity.findMany({
    where: { userId: session.user.id },
    include: { carbonRecords: true },
    orderBy: { occurredAt: "desc" }
  });
  return NextResponse.json({ activities });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = activitySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid activity details" }, { status: 400 });

  const { category, type, amount, unit, notes } = parsed.data;
  const factor = carbonFactors[type];
  if (factor === undefined) return NextResponse.json({ error: "Unknown emission factor" }, { status: 400 });

  const activity = await prisma.activity.create({
    data: {
      userId: session.user.id,
      category,
      type,
      amount,
      unit,
      notes,
      carbonRecords: {
        create: {
          userId: session.user.id,
          factor,
          emissionKg: calculateEmission(type, amount)
        }
      }
    },
    include: { carbonRecords: true }
  });

  return NextResponse.json({ activity }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = activityUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid activity details" }, { status: 400 });

  const { id, category, type, amount, unit, notes } = parsed.data;
  const factor = carbonFactors[type];
  if (factor === undefined) return NextResponse.json({ error: "Unknown emission factor" }, { status: 400 });

  const existing = await prisma.activity.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Activity not found" }, { status: 404 });

  const [activity] = await prisma.$transaction([
    prisma.activity.update({
      where: { id },
      data: { category, type, amount, unit, notes },
      include: { carbonRecords: true }
    }),
    prisma.carbonRecord.updateMany({
      where: { activityId: id, userId: session.user.id },
      data: {
        factor,
        emissionKg: calculateEmission(type, amount)
      }
    })
  ]);

  return NextResponse.json({ activity });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = activityDeleteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid activity" }, { status: 400 });

  await prisma.activity.deleteMany({
    where: {
      id: parsed.data.id,
      userId: session.user.id
    }
  });

  return NextResponse.json({ ok: true });
}
