import { Medal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
    take: 20,
    select: { id: true, name: true, points: true, badges: true, challengeCompletions: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Leaderboard</h1>
        <p className="text-muted-foreground">Top eco users ranked by challenge points.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top eco users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between rounded-md border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary font-bold">#{index + 1}</div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.challengeCompletions.length} challenges · {user.badges.length} badges</div>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-primary">
                <Medal className="h-4 w-4" /> {user.points}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
