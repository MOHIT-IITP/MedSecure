"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from "../../components/ui";
import {
  User,
  Shield,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from "../../components/ui/icons";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.user) {
          setUser(d.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <AppShell
      title="Account Settings"
      subtitle="Manage your profile credentials, authentication sessions, and security preferences."
    >
      <div className="max-w-3xl space-y-6">
        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                <CardTitle>Account Overview</CardTitle>
              </div>
              <Badge variant="success" size="sm">
                Active Session
              </Badge>
            </div>
            <CardDescription>
              Basic identity information linked to this device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="h-6 w-64 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : user ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Full Name
                  </span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Could not retrieve account details.</p>
            )}
          </CardContent>
        </Card>

        {/* Security & Authentication Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-slate-500" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>
              Session tokens and emergency data sharing rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-lg bg-slate-50/60 p-3.5 border border-slate-100">
              <Lock size={16} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">
                  HTTP-Only JWT Session Storage
                </p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Your authentication cookies are encrypted and securely signed. They automatically expire after 7 days of inactivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-slate-50/60 p-3.5 border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">
                  Zero-Knowledge Document Shielding
                </p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Public QR scans only expose your emergency summary. Private medical documents remain restricted to authenticated sessions.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Need to switch accounts or end session?
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
