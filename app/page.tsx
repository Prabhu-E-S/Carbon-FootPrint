import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Leaf, ShieldCheck, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  { icon: BarChart3, title: "Emission intelligence", text: "Track transport, meals, electricity, and waste with clear kg CO2 estimates." },
  { icon: Bot, title: "AI sustainability coach", text: "Get habit changes and weekly goals generated from your activity history." },
  { icon: Trophy, title: "Eco challenges", text: "Complete climate-positive challenges, earn points, and collect badges." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          CarbonWise AI
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Start</Link>
          </Button>
        </div>
      </nav>

      <section className="leaf-grid border-y">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-accent" />
              Hackathon-ready climate intelligence
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal sm:text-6xl">
              Understand and reduce your carbon footprint with AI.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              CarbonWise AI turns everyday choices into measurable climate impact, personalized coaching, and friendly challenges that help better habits stick.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Create account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Try demo login</Link>
              </Button>
            </div>
          </div>

          <div className="grid content-end gap-4">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CardHeader>
                <CardTitle>Today’s footprint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-5xl font-bold">7.8 kg</div>
                <div className="h-3 rounded-full bg-secondary">
                  <div className="h-3 w-2/3 rounded-full bg-primary" />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <Stat label="Saved" value="18%" />
                  <Stat label="Score" value="82" />
                  <Stat label="Rank" value="#4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{feature.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/45">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
          <StatCard value="4" label="tracked activity categories" />
          <StatCard value="12+" label="emission factors included" />
          <StatCard value="3" label="seeded eco challenges" />
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>CarbonWise AI</span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Data-driven sustainability nudges
        </span>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary p-3">
      <div className="font-semibold">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center shadow-soft">
      <div className="text-4xl font-bold text-primary">{value}</div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}
