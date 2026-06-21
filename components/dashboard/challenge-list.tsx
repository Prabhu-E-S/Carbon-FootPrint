"use client";

import { Challenge } from "@prisma/client";
import { Award, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChallengeWithStatus = Challenge & { completed: boolean };

export function ChallengeList({ challenges }: { challenges: ChallengeWithStatus[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function complete(challengeId: string) {
    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId })
    });
    if (!response.ok) {
      toast.error("Challenge could not be completed");
      return;
    }
    toast.success("Challenge completed. Badge awarded.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle>{challenge.title}</CardTitle>
              {challenge.completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Award className="h-5 w-5 text-accent" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span>{challenge.points} points</span>
              <span className="font-medium">{challenge.badgeName}</span>
            </div>
            <Button className="w-full" disabled={challenge.completed || pending} onClick={() => complete(challenge.id)}>
              {challenge.completed ? "Completed" : "Mark complete"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
