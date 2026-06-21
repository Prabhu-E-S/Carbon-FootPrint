import { auth } from "@/auth";
import { ActivityForm } from "@/components/dashboard/activity-form";
import { ActivityList } from "@/components/dashboard/activity-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activityCatalog } from "@/lib/carbon";
import { prisma } from "@/lib/prisma";

export default async function ActivityPage() {
  const session = await auth();
  const activities = await prisma.activity.findMany({
    where: { userId: session!.user.id },
    include: { carbonRecords: true },
    orderBy: { occurredAt: "desc" },
    take: 12
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Activity tracker</h1>
        <p className="text-muted-foreground">Add daily choices and CarbonWise will calculate emissions automatically.</p>
      </div>
      <ActivityForm catalog={activityCatalog} />
      <Card>
        <CardHeader>
          <CardTitle>Logged activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList
            catalog={activityCatalog}
            activities={activities.map((activity) => ({
              id: activity.id,
              category: activity.category,
              type: activity.type,
              amount: activity.amount,
              unit: activity.unit,
              notes: activity.notes ?? "",
              emissionKg: activity.carbonRecords[0]?.emissionKg ?? 0
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
