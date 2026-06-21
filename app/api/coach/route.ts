import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

const coachSchema = z.object({ message: z.string().min(2).max(1000) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = coachSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Ask a sustainability question." }, { status: 400 });

  const [user, dashboard] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getDashboardData(session.user.id)
  ]);

  const summary = {
    user: user?.name,
    goal: user?.sustainabilityGoal,
    preferredTransport: user?.preferredTransport,
    totals: dashboard.totals,
    categories: dashboard.categories,
    recentActivities: dashboard.recentActivities.slice(0, 5)
  };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: fallbackCoach(parsed.data.message, summary)
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are CarbonWise AI, a practical sustainability coach. Give concise, personalized, evidence-based suggestions using the user's carbon activity data. Avoid guilt; focus on realistic habits and weekly goals."
      },
      {
        role: "user",
        content: `User data: ${JSON.stringify(summary)}\n\nQuestion: ${parsed.data.message}`
      }
    ]
  });

  return NextResponse.json({ reply: response.output_text });
}

function fallbackCoach(message: string, summary: unknown) {
  const text = JSON.stringify(summary);
  return `Here is a personalized starting point based on your CarbonWise data: prioritize the highest-emission category this week, replace one car or flight-heavy trip with bus/train/cycling where possible, and plan two lower-carbon meals. For your question "${message}", set a simple 7-day goal: log every activity, complete one eco challenge, and reduce your weekly total by 10%. Add OPENAI_API_KEY to .env for deeper AI-generated coaching. Data snapshot: ${text.slice(0, 420)}.`;
}
