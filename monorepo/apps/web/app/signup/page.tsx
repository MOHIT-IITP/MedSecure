"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPageShell } from "../../components/auth-page-shell";
import { Button, Input, Label, Alert } from "../../components/ui";

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

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const fieldErrors = data.error?.fieldErrors;
        if (fieldErrors) {
          const firstMsg = Object.values(fieldErrors).flat().filter(Boolean)[0];
          setError(typeof firstMsg === "string" ? firstMsg : (data.message ?? "Validation failed."));
        } else {
          setError(data.message ?? "Registration failed. Check your details.");
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
      title="Create an account"
      description="Start managing your digital health profile and emergency records securely."
      footerText="Already have an account?"
      footerHref="/login"
      footerLinkLabel="Sign in"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="signup-name" required>
            Full Name
          </Label>
          <Input
            id="signup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <Label htmlFor="signup-email" required>
            Email Address
          </Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Label htmlFor="signup-password" required>
            Password
          </Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            helperText="Must be 8 or more characters"
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
            Create Account
          </Button>
        </div>
      </form>
    </AuthPageShell>
  );
}
