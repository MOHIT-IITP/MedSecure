"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AppShell } from "../../components/app-shell";
import { Card } from "../../components/ui";

export default function QRPage() {
  const [qr, setQr] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/qr");
      const data = await res.json();

      if (!res.ok || !data.qrUrl) {
        setError("Could not load QR code. Make sure you are logged in.");
        return;
      }

      setUrl(data.qrUrl);
      const qrImage = await QRCode.toDataURL(data.qrUrl, { width: 280, margin: 2 });
      setQr(qrImage);
    }

    load();
  }, []);

  return (
    <AppShell title="Your emergency QR code">
      <p className="-mt-4 mb-6 text-slate-600">
        Anyone who scans this code opens your public emergency dashboard — no login
        required. Only profile and recent health logs are shared, not your reports.
      </p>

      <Card className="flex max-w-md flex-col items-center text-center">
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : qr ? (
          <>
            <img src={qr} alt="MedSecure QR code" className="rounded-lg" />
            <p className="mt-4 break-all text-xs text-slate-500">{url}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-sm font-medium text-teal-700 hover:underline"
            >
              Open public view
            </a>
          </>
        ) : (
          <p className="text-sm text-slate-600">Generating QR…</p>
        )}
      </Card>
    </AppShell>
  );
}
