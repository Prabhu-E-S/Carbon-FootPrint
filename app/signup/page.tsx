import Link from "next/link";
import { Leaf } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-primary" /> CarbonWise AI
        </Link>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
