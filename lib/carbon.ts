import { ActivityCategory } from "@prisma/client";

export const carbonFactors: Record<string, number> = {
  car: 0.21,
  bike: 0,
  bus: 0.08,
  train: 0.04,
  flight: 0.25,
  vegetarian: 1.1,
  chicken: 2.5,
  beef: 8,
  seafood: 5,
  ac: 1.6,
  fan: 0.06,
  appliance: 0.35,
  plastic: 6,
  paper: 1.3,
  general: 2.1
};

export const activityCatalog = {
  TRANSPORTATION: [
    { value: "car", label: "Car", unit: "km" },
    { value: "bike", label: "Bike", unit: "km" },
    { value: "bus", label: "Bus", unit: "km" },
    { value: "train", label: "Train", unit: "km" },
    { value: "flight", label: "Flight", unit: "km" }
  ],
  FOOD: [
    { value: "vegetarian", label: "Vegetarian", unit: "meals" },
    { value: "chicken", label: "Chicken", unit: "meals" },
    { value: "beef", label: "Beef", unit: "meals" },
    { value: "seafood", label: "Seafood", unit: "meals" }
  ],
  ELECTRICITY: [
    { value: "ac", label: "AC usage", unit: "hours" },
    { value: "fan", label: "Fan usage", unit: "hours" },
    { value: "appliance", label: "Appliance usage", unit: "hours" }
  ],
  WASTE: [
    { value: "plastic", label: "Plastic", unit: "kg" },
    { value: "paper", label: "Paper", unit: "kg" },
    { value: "general", label: "General waste", unit: "kg" }
  ]
} satisfies Record<ActivityCategory, { value: string; label: string; unit: string }[]>;

export function calculateEmission(type: string, amount: number) {
  const factor = carbonFactors[type] ?? 0;
  return Number((factor * amount).toFixed(2));
}

export function scoreFromEmissions(monthlyKg: number) {
  return Math.max(0, Math.min(100, Math.round(100 - monthlyKg / 5)));
}
