"use client";

import { ActivityCategory } from "@prisma/client";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatKg } from "@/lib/utils";

type Catalog = Record<ActivityCategory, { value: string; label: string; unit: string }[]>;

type ActivityItem = {
  id: string;
  category: ActivityCategory;
  type: string;
  amount: number;
  unit: string;
  notes: string;
  emissionKg: number;
};

export function ActivityList({ activities, catalog }: { activities: ActivityItem[]; catalog: Catalog }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function remove(id: string) {
    if (!window.confirm("Remove this activity?")) return;

    const response = await fetch("/api/activities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      toast.error("Could not remove activity");
      return;
    }

    toast.success("Activity removed");
    startTransition(() => router.refresh());
  }

  if (!activities.length) {
    return <p className="text-sm text-muted-foreground">No activities logged yet.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) =>
        editingId === activity.id ? (
          <EditableActivityRow
            key={activity.id}
            activity={activity}
            catalog={catalog}
            pending={pending}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              startTransition(() => router.refresh());
            }}
          />
        ) : (
          <div key={activity.id} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <div>
              <div className="font-medium capitalize">{activity.type}</div>
              <div className="text-sm text-muted-foreground">
                {activity.category.toLowerCase()} · {activity.amount} {activity.unit}
                {activity.notes ? ` · ${activity.notes}` : ""}
              </div>
            </div>
            <div className="font-semibold">{formatKg(activity.emissionKg)}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" aria-label="Edit activity" onClick={() => setEditingId(activity.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" aria-label="Remove activity" disabled={pending} onClick={() => remove(activity.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EditableActivityRow({
  activity,
  catalog,
  pending,
  onCancel,
  onSaved
}: {
  activity: ActivityItem;
  catalog: Catalog;
  pending: boolean;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [category, setCategory] = useState<ActivityCategory>(activity.category);
  const [type, setType] = useState(activity.type);
  const selected = useMemo(() => catalog[category].find((item) => item.value === type) ?? catalog[category][0], [catalog, category, type]);

  function updateCategory(value: ActivityCategory) {
    setCategory(value);
    setType(catalog[value][0].value);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activity.id,
        category,
        type,
        amount: Number(form.get("amount")),
        unit: selected.unit,
        notes: String(form.get("notes") ?? "")
      })
    });

    if (!response.ok) {
      toast.error("Could not update activity");
      return;
    }

    toast.success("Activity updated");
    onSaved();
  }

  return (
    <form className="grid gap-3 rounded-md border p-3 lg:grid-cols-[1fr_1fr_140px_1fr_auto]" onSubmit={save}>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(value) => updateCategory(value as ActivityCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(catalog).map((key) => (
              <SelectItem key={key} value={key}>
                {key.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {catalog[category].map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`amount-${activity.id}`}>Amount ({selected.unit})</Label>
        <Input id={`amount-${activity.id}`} name="amount" type="number" min="0.1" step="0.1" defaultValue={activity.amount} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`notes-${activity.id}`}>Notes</Label>
        <Input id={`notes-${activity.id}`} name="notes" defaultValue={activity.notes} placeholder="Optional" />
      </div>
      <div className="flex items-end gap-2">
        <Button size="icon" aria-label="Save activity" disabled={pending}>
          <Check className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" aria-label="Cancel edit" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
