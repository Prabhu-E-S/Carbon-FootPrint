import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Settings</h1>
        <p className="text-muted-foreground">Update your account details and sustainability preferences.</p>
      </div>
      <SettingsForm user={user!} />
    </div>
  );
}
