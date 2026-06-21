"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({ user }: { user: User }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name")),
        email: String(form.get("email")),
        sustainabilityGoal: String(form.get("sustainabilityGoal")),
        preferredTransport: String(form.get("preferredTransport"))
      })
    });
    if (!response.ok) {
      toast.error("Settings could not be saved");
      return;
    }
    toast.success("Settings updated");
    startTransition(() => router.refresh());
  }

  return (
    <Card>
      <CardHeader><CardTitle>Account preferences</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Field label="Name" name="name" defaultValue={user.name} />
          <Field label="Email" name="email" type="email" defaultValue={user.email} />
          <Field label="Sustainability goal" name="sustainabilityGoal" defaultValue={user.sustainabilityGoal} />
          <Field label="Preferred transport" name="preferredTransport" defaultValue={user.preferredTransport} />
          <div className="md:col-span-2">
            <Button disabled={pending}>Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}
