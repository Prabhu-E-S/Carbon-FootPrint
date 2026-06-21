import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ChallengeList } from "@/components/dashboard/challenge-list";

export default async function ChallengesPage() {
  const session = await auth();
  const challenges = await prisma.challenge.findMany({
    include: { completions: { where: { userId: session!.user.id } } },
    orderBy: { points: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Eco challenges</h1>
        <p className="text-muted-foreground">Complete climate-positive missions to earn points and badges.</p>
      </div>
      <ChallengeList challenges={challenges.map((item) => ({ ...item, completed: item.completions.length > 0 }))} />
    </div>
  );
}
