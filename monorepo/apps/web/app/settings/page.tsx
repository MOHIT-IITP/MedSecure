"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { Button, Card } from "../../components/ui";

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUser(d.user);
      });
  }, []);

  return (
    <AppShell title="Settings">
      <Card className="glass-panel-strong max-w-lg border-white/10 bg-white/6 p-6 text-white shadow-none sm:p-8">
        <h2 className="text-xl font-semibold text-white">Account</h2>
        {user ? (
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-white/45">Name</dt>
              <dd className="mt-1 font-medium text-white/90">{user.name}</dd>
            </div>
            <div>
              <dt className="text-white/45">Email</dt>
              <dd className="mt-1 font-medium text-white/90">{user.email}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-white/65">Loading account…</p>
        )}
        <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/65">
          Session cookies expire after 7 days. Use the header to log out on shared
          devices.
        </p>
      </Card>
    </AppShell>
  );
}
