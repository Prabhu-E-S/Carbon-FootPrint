import { CoachChat } from "@/components/dashboard/coach-chat";

export default function CoachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">AI sustainability coach</h1>
        <p className="text-muted-foreground">Ask for footprint reductions, habit changes, or weekly goals based on your data.</p>
      </div>
      <CoachChat />
    </div>
  );
}
