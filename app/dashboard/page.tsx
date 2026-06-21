import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { EmissionsCharts } from "@/components/charts/emissions-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKg } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Welcome back, {session!.user.name}</h1>
        <p className="text-muted-foreground">Your carbon footprint snapshot and progress indicators.</p>
      </div>
      <StatGrid totals={data.totals} />
      <EmissionsCharts daily={data.daily} categories={data.categories} monthlyTrend={data.monthlyTrend} />
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <div className="font-medium capitalize">{activity.type}</div>
                <div className="text-muted-foreground">
                  {activity.category} · {activity.amount} {activity.unit}
                </div>
              </div>
              <div className="font-semibold">{formatKg(activity.emissionKg)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
