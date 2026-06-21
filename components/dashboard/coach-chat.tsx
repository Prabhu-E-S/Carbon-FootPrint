"use client";

import { Bot, Send, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "How can I reduce my footprint?",
  "What habits should I change?",
  "Give me weekly sustainability goals."
];

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me about low-carbon habits, weekly goals, or your largest emission sources." }
  ]);
  const [loading, setLoading] = useState(false);

  async function ask(content: string) {
    if (!content.trim()) return;
    setMessages((current) => [...current, { role: "user", content }]);
    setLoading(true);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content })
      });
      if (!response.ok) throw new Error("Coach unavailable");
      const data = (await response.json()) as { reply: string };
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not contact coach");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized coach</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button key={suggestion} variant="secondary" size="sm" onClick={() => ask(suggestion)}>
              {suggestion}
            </Button>
          ))}
        </div>
        <div className="min-h-96 space-y-3 rounded-md border bg-background p-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className="flex gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </span>
              <p className="max-w-3xl whitespace-pre-wrap text-sm leading-6">{message.content}</p>
            </div>
          ))}
          {loading && <Skeleton className="h-16 w-full" />}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const message = String(form.get("message") ?? "");
            event.currentTarget.reset();
            ask(message);
          }}
        >
          <Input name="message" placeholder="Ask CarbonWise AI..." />
          <Button disabled={loading} size="icon" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
