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
      <Card className="max-w-lg">
        <h2 className="font-medium text-slate-900">Account</h2>
        {user ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Loading account…</p>
        )}
        <p className="mt-6 text-sm text-slate-600">
          Session cookies expire after 7 days. Use the header to log out on shared
          devices.
        </p>
      </Card>
    </AppShell>
  );
}
