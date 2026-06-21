import { PrismaClient, ActivityCategory } from "@prisma/client";
import bcrypt from "bcryptjs";
import { carbonFactors, calculateEmission } from "../lib/carbon";

const prisma = new PrismaClient();

async function main() {
  await prisma.badge.deleteMany();
  await prisma.challengeCompletion.deleteMany();
  await prisma.carbonRecord.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Aarav Green", email: "demo@carbonwise.ai", passwordHash, points: 420 }
    }),
    prisma.user.create({
      data: { name: "Maya Solar", email: "maya@example.com", passwordHash, points: 360 }
    }),
    prisma.user.create({
      data: { name: "Noah Forest", email: "noah@example.com", passwordHash, points: 290 }
    })
  ]);

  const challenges = await prisma.challenge.createManyAndReturn({
    data: [
      {
        title: "No Car Day",
        description: "Use public transit, walking, or cycling for an entire day.",
        category: ActivityCategory.TRANSPORTATION,
        points: 80,
        badgeName: "Low-Carbon Commuter"
      },
      {
        title: "Plastic Free Week",
        description: "Avoid single-use plastic purchases for seven days.",
        category: ActivityCategory.WASTE,
        points: 140,
        badgeName: "Waste Warrior"
      },
      {
        title: "Vegetarian Challenge",
        description: "Choose vegetarian meals for three consecutive days.",
        category: ActivityCategory.FOOD,
        points: 110,
        badgeName: "Plant Plate Pro"
      }
    ]
  });

  const demoActivities = [
    { category: ActivityCategory.TRANSPORTATION, type: "car", amount: 12, unit: "km", daysAgo: 0 },
    { category: ActivityCategory.FOOD, type: "vegetarian", amount: 2, unit: "meals", daysAgo: 1 },
    { category: ActivityCategory.ELECTRICITY, type: "ac", amount: 4, unit: "hours", daysAgo: 2 },
    { category: ActivityCategory.WASTE, type: "plastic", amount: 1.5, unit: "kg", daysAgo: 3 },
    { category: ActivityCategory.TRANSPORTATION, type: "bus", amount: 18, unit: "km", daysAgo: 4 },
    { category: ActivityCategory.FOOD, type: "chicken", amount: 1, unit: "meals", daysAgo: 6 },
    { category: ActivityCategory.TRANSPORTATION, type: "train", amount: 35, unit: "km", daysAgo: 13 }
  ];

  for (const user of users) {
    for (const item of demoActivities) {
      const occurredAt = new Date();
      occurredAt.setDate(occurredAt.getDate() - item.daysAgo);
      const factor = carbonFactors[item.type] ?? 0;
      const activity = await prisma.activity.create({
        data: {
          userId: user.id,
          category: item.category,
          type: item.type,
          amount: item.amount,
          unit: item.unit,
          occurredAt
        }
      });
      await prisma.carbonRecord.create({
        data: {
          userId: user.id,
          activityId: activity.id,
          factor,
          emissionKg: calculateEmission(item.type, item.amount)
        }
      });
    }
  }

  await prisma.challengeCompletion.create({
    data: { userId: users[0].id, challengeId: challenges[0].id }
  });
  await prisma.badge.create({
    data: { userId: users[0].id, name: challenges[0].badgeName, icon: "Train" }
  });

  console.log("Seeded CarbonWise AI demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
