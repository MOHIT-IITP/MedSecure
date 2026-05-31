"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthAlert,
  AuthButton,
  AuthInput,
  AuthLabel,
  AuthPageShell,
} from "../../components/auth-page-shell";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setError(data.message ?? "Signup failed. Check your details.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthPageShell
      title="Create account"
      description="Start managing your health records securely."
      footerText="Already have an account?"
      footerHref="/login"
      footerLinkLabel="Log in"
    >
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <AuthLabel>Full name</AuthLabel>
          <AuthInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <AuthLabel>Email</AuthLabel>
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <AuthLabel>Password</AuthLabel>
          <AuthInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>

        {error && <AuthAlert>{error}</AuthAlert>}

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </AuthButton>
      </form>
    </AuthPageShell>
  );
}
