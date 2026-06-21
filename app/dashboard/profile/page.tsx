import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKg } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  const [user, data] = await Promise.all([
    prisma.user.findUnique({ where: { id: session!.user.id }, include: { challengeCompletions: true, badges: true } }),
    getDashboardData(session!.user.id)
  ]);
  const estimatedBaseline = data.totals.monthly * 1.25;
  const savings = Math.max(0, estimatedBaseline - data.totals.monthly);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Profile</h1>
        <p className="text-muted-foreground">Personal statistics, savings, and achievements.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Total savings</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{formatKg(savings)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Challenges completed</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{user?.challengeCompletions.length ?? 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Points</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{user?.points ?? 0}</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {user?.badges.length ? user.badges.map((badge) => (
            <span key={badge.id} className="rounded-full border bg-secondary px-4 py-2 text-sm font-medium">{badge.name}</span>
          )) : <span className="text-sm text-muted-foreground">Complete challenges to earn badges.</span>}
        </CardContent>
      </Card>
    </div>
  );
}
