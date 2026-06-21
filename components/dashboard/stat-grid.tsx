import { Award, CalendarDays, Gauge, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKg } from "@/lib/utils";

export function StatGrid({ totals }: { totals: { total: number; weekly: number; monthly: number; score: number; completed: number; badges: number } }) {
  const stats = [
    { title: "Total footprint", value: formatKg(totals.total), icon: Leaf },
    { title: "Weekly footprint", value: formatKg(totals.weekly), icon: CalendarDays },
    { title: "Monthly footprint", value: formatKg(totals.monthly), icon: Gauge },
    { title: "Sustainability score", value: `${totals.score}/100`, icon: Award }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-3 h-2 rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, totals.score)}%` }} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
