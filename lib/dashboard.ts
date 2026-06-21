import { ActivityCategory } from "@prisma/client";
import { endOfMonth, format, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { scoreFromEmissions } from "@/lib/carbon";

export async function getDashboardData(userId: string) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const records = await prisma.carbonRecord.findMany({
    where: { userId },
    include: { activity: true },
    orderBy: { createdAt: "asc" }
  });

  const total = sum(records.map((r) => r.emissionKg));
  const weekly = sum(records.filter((r) => r.activity.occurredAt >= weekStart).map((r) => r.emissionKg));
  const monthly = sum(records.filter((r) => r.activity.occurredAt >= monthStart).map((r) => r.emissionKg));
  const score = scoreFromEmissions(monthly);

  const dailyMap = new Map<string, number>();
  records.forEach((record) => {
    const day = format(record.activity.occurredAt, "EEE");
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + record.emissionKg);
  });

  const categoryMap = new Map<ActivityCategory, number>();
  records.forEach((record) => {
    const category = record.activity.category;
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + record.emissionKg);
  });

  const monthlyTrend = Array.from({ length: 6 }).map((_, index) => {
    const month = subMonths(now, 5 - index);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return {
      month: format(month, "MMM"),
      kg: Number(
        sum(
          records
            .filter((record) => record.activity.occurredAt >= start && record.activity.occurredAt <= end)
            .map((record) => record.emissionKg)
        ).toFixed(2)
      )
    };
  });

  const completed = await prisma.challengeCompletion.count({ where: { userId } });
  const badges = await prisma.badge.findMany({ where: { userId }, orderBy: { earnedAt: "desc" } });

  return {
    totals: { total, weekly, monthly, score, completed, badges: badges.length },
    daily: Array.from(dailyMap, ([day, kg]) => ({ day, kg: Number(kg.toFixed(2)) })),
    categories: Array.from(categoryMap, ([name, kg]) => ({ name: titleCase(name), kg: Number(kg.toFixed(2)) })),
    monthlyTrend,
    recentActivities: records
      .slice(-6)
      .reverse()
      .map((record) => ({
        id: record.id,
        type: record.activity.type,
        category: titleCase(record.activity.category),
        amount: record.activity.amount,
        unit: record.activity.unit,
        emissionKg: record.emissionKg,
        occurredAt: record.activity.occurredAt
      })),
    badges
  };
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function titleCase(value: string) {
  return value.toLowerCase().replace(/(^|_)(\w)/g, (_, space, letter) => `${space ? " " : ""}${letter.toUpperCase()}`);
}
