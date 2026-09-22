"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPageShell } from "../../components/auth-page-shell";
import { Button, Input, Label, Alert } from "../../components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const fieldErrors = data.error?.fieldErrors;
        if (fieldErrors) {
          const firstMsg = Object.values(fieldErrors).flat().filter(Boolean)[0];
          setError(typeof firstMsg === "string" ? firstMsg : (data.message ?? "Invalid email or password."));
        } else {
          setError(data.message ?? "Invalid email or password.");
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell
      title="Welcome back"
      description="Enter your credentials to access your health records."
      footerText="Don't have an account?"
      footerHref="/signup"
      footerLinkLabel="Create an account"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="login-email" required>
            Email Address
          </Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="login-password" required className="mb-0">
              Password
            </Label>
          </div>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full h-10"
          >
            Sign In
          </Button>
        </div>
      </form>
    </AuthPageShell>
  );
}
