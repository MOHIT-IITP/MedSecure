"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { Alert, Button, Card, Input, Label, Textarea } from "../../components/ui";

type UserProfile = {
  name: string;
  email: string;
  age: number | null;
  bloodGroup: string | null;
  allergies: string | null;
  chronicDiseases: string | null;
  emergencyContact: string | null;
};

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    allergies: "",
    chronicDiseases: "",
    emergencyContact: "",
  });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.user) {
        setError("Could not load profile.");
        return;
      }

      const user = data.user as UserProfile;
      setEmail(user.email);
      setForm({
        name: user.name ?? "",
        age: user.age != null ? String(user.age) : "",
        bloodGroup: user.bloodGroup ?? "",
        allergies: user.allergies ?? "",
        chronicDiseases: user.chronicDiseases ?? "",
        emergencyContact: user.emergencyContact ?? "",
      });
    }

    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        bloodGroup: form.bloodGroup || undefined,
        allergies: form.allergies || undefined,
        chronicDiseases: form.chronicDiseases || undefined,
        emergencyContact: form.emergencyContact || undefined,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok || !data.success) {
      setError("Failed to save profile.");
      return;
    }

    setMessage("Profile saved. This info appears on your emergency QR view.");
  }

  if (loading) {
    return (
      <AppShell title="Profile">
        <p className="text-white/70">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile & emergency info">
      <p className="-mt-4 mb-6 text-white/65">
        Fields marked for emergency sharing are visible when someone scans your QR code.
      </p>

      <Card className="glass-panel-strong backdrop-blur-2xl border-white/10 bg-white/6 p-6 text-white shadow-none sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="text-white/70">Email</Label>
            <Input
              value={email}
              disabled
              className="border-white/10 bg-white/5 text-white/70 placeholder:text-white/30 disabled:opacity-100"
            />
          </div>
          <div>
            <Label className="text-white/70">Full name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-white/70">Age</Label>
              <Input
                type="number"
                min={0}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
              />
            </div>
            <div>
              <Label className="text-white/70">Blood group</Label>
              <Input
                placeholder="e.g. O+"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
              />
            </div>
          </div>
          <div>
            <Label className="text-white/70">Emergency contact</Label>
            <Input
              placeholder="Phone or name + phone"
              value={form.emergencyContact}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: e.target.value })
              }
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
            />
          </div>
          <div>
            <Label className="text-white/70">Allergies</Label>
            <Textarea
              rows={2}
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
            />
          </div>
          <div>
            <Label className="text-white/70">Chronic conditions</Label>
            <Textarea
              rows={2}
              value={form.chronicDiseases}
              onChange={(e) =>
                setForm({ ...form, chronicDiseases: e.target.value })
              }
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
            />
          </div>

          {error && (
            <Alert className="border border-rose-400/20 bg-rose-400/10 text-rose-100">
              {error}
            </Alert>
          )}
          {message && (
            <Alert tone="success" className="border border-emerald-400/20 bg-emerald-400/10 text-white">
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-300 hover:to-cyan-400"
          >
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
