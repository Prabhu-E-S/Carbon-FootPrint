"use client";

import { ActivityCategory } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Catalog = Record<ActivityCategory, { value: string; label: string; unit: string }[]>;

export function ActivityForm({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState<ActivityCategory>("TRANSPORTATION");
  const [type, setType] = useState(catalog.TRANSPORTATION[0].value);
  const selected = useMemo(() => catalog[category].find((item) => item.value === type) ?? catalog[category][0], [catalog, category, type]);

  function updateCategory(value: ActivityCategory) {
    setCategory(value);
    setType(catalog[value][0].value);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const payload = {
      category,
      type,
      amount: Number(form.get("amount")),
      unit: selected.unit,
      notes: String(form.get("notes") ?? "")
    };

    const response = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      toast.error("Could not save activity");
      return;
    }
    toast.success("Activity logged");
    formElement.reset();
    startTransition(() => router.refresh());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add activity</CardTitle>
        <CardDescription>Choose a category, enter usage, and the calculator stores the CO2 estimate.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => updateCategory(value as ActivityCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(catalog).map((key) => (
                  <SelectItem key={key} value={key}>{key.toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {catalog[category].map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({selected.unit})</Label>
            <Input id="amount" name="amount" type="number" min="0.1" step="0.1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Optional" />
          </div>
          <div className="flex items-end">
            <Button className="w-full" disabled={pending}>Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
