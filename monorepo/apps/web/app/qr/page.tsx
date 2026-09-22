"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
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
  Alert,
} from "../../components/ui";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Lock,
  Eye,
  AlertCircle,
} from "../../components/ui/icons";

export default function QRPage() {
  const [qrImage, setQrImage] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadQR() {
      try {
        const res = await fetch("/api/qr");
        const data = await res.json();

        if (!res.ok || !data.qrUrl) {
          setError(
            data.message ?? "Could not generate QR code. Ensure you are authenticated."
          );
          return;
        }

        setUrl(data.qrUrl);
        const image = await QRCode.toDataURL(data.qrUrl, {
          width: 360,
          margin: 2,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        setQrImage(image);
      } catch (err) {
        console.error("QR load failed", err);
        setError("Network error generating QR code.");
      } finally {
        setLoading(false);
      }
    }

    loadQR();
  }, []);

  async function handleCopy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  function handleDownload() {
    if (!qrImage) return;
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "medsecure-emergency-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <AppShell
      title="Emergency QR Access"
      subtitle="Share essential emergency health information quickly without requiring a login."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl">
        {/* Left column: QR Card & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="text-center overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex items-center justify-center gap-2">
                <Shield size={16} className="text-slate-900" />
                <CardTitle className="text-sm">Verified Emergency Badge</CardTitle>
              </div>
              <CardDescription>
                Scan with any standard smartphone camera
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 flex flex-col items-center">
              {loading ? (
                <div className="h-64 w-64 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
                  <span className="text-xs text-slate-400">Generating secure code...</span>
                </div>
              ) : error ? (
                <Alert tone="error">{error}</Alert>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImage}
                    alt="MedSecure Emergency QR Code"
                    className="w-64 h-64 rounded-lg object-contain"
                  />
                </div>
              )}

              {url && (
                <p className="mt-4 max-w-sm text-xs text-slate-400 font-mono break-all px-4 py-1.5 bg-slate-50 rounded border border-slate-100">
                  {url}
                </p>
              )}
            </CardContent>

            <CardFooter className="bg-slate-50/70 p-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!qrImage}
                className="flex items-center gap-1.5"
              >
                <Download size={15} />
                <span>Download PNG</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!url}
                className="flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check size={15} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied Link</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>Copy Link</span>
                  </>
                )}
              </Button>

              {url && (
                <a href={url} target="_blank" rel="noreferrer">
                  <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                    <ExternalLink size={15} />
                    <span>Open Public View</span>
                  </Button>
                </a>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Right column: Security Architecture & Disclosure */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-slate-700" />
                <CardTitle className="text-sm">Security & Privacy Model</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-[11px]">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Tokenized public URL</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    The QR code encodes a 128-bit cryptographically secure UUID token rather than your database user ID.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 font-bold text-[11px]">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Zero authentication barrier</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    First responders, EMTs, and ER personnel do not need to create an account or sign in to read emergency health data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 font-bold text-[11px]">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Reports remain confidential</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Private diagnostic reports and uploaded PDFs are never exposed on the public QR view. Only emergency fields and vital history are shown.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <AlertCircle size={14} className="text-slate-500" />
              <span>Recommended Usage</span>
            </div>
            Print this QR code to keep in your wallet, save it as your phone lock screen wallpaper, or attach it to a medical ID bracelet.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
