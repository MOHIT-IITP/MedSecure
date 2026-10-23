'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ShieldAlert,
  Clock,
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

interface GeneratedQrToken {
  token: string;
  expiresAt: string;
  label?: string;
}

export default function QrManagementPage() {
  const [activeToken, setActiveToken] = useState<GeneratedQrToken | null>(null);
  const [expiresInHours, setExpiresInHours] = useState<number>(24);
  const [label, setLabel] = useState<string>('Emergency Badge');
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
      // Load saved token from session storage if exists
      const saved = sessionStorage.getItem('medsecure_active_qr');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (new Date(parsed.expiresAt).getTime() > Date.now()) {
            setActiveToken(parsed);
          } else {
            sessionStorage.removeItem('medsecure_active_qr');
          }
        } catch {
          sessionStorage.removeItem('medsecure_active_qr');
        }
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setStatusMessage(null);

    try {
      const res = await apiFetch<GeneratedQrToken>('/qr', {
        method: 'POST',
        body: JSON.stringify({
          expiresInHours,
          label: label.trim() || undefined,
        }),
      });

      setActiveToken(res);
      sessionStorage.setItem('medsecure_active_qr', JSON.stringify(res));
      setStatusMessage({
        type: 'success',
        text: 'New emergency QR code generated successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to generate QR token.',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke all active emergency QR codes? Anyone scanning your previous badge will be denied access.')) {
      return;
    }

    setRevoking(true);
    setStatusMessage(null);

    try {
      await apiFetch('/qr/revoke', { method: 'POST' });
      setActiveToken(null);
      sessionStorage.removeItem('medsecure_active_qr');
      setStatusMessage({
        type: 'success',
        text: 'All emergency QR tokens have been immediately revoked.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to revoke QR tokens.',
      });
    } finally {
      setRevoking(false);
    }
  };

  const publicUrl = activeToken && origin ? `${origin}/profile/${activeToken.token}` : '';

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Emergency Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
          Emergency QR Code
        </h1>
        <p className="text-sm text-muted-brown mt-1">
          Generate temporary, cryptographically revocable QR badges for physical cards, medical tags, or emergency responder intake.
        </p>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-forest/10 border border-forest/30 text-forest'
              : 'bg-terracotta/10 border border-terracotta/30 text-terracotta'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: QR Display & Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Code Display / State */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm flex flex-col items-center text-center">
          {activeToken ? (
            <div className="w-full flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/30 text-forest text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                <span>Active Badge Valid</span>
              </div>

              {/* QR Container */}
              <div className="p-4 rounded-2xl bg-ivory border-2 border-dashed border-sand/90 shadow-inner flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCodeSVG
                    value={publicUrl}
                    size={220}
                    level="H"
                    includeMargin={false}
                    fgColor="#344B3C"
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs font-semibold text-dark-brown">
                  {activeToken.label || 'Emergency Access Token'}
                </p>
                <p className="text-[11px] text-muted-brown flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-terracotta" />
                  <span>Expires {new Date(activeToken.expiresAt).toLocaleString()}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 w-full space-y-2.5">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cream border border-sand hover:bg-sand/40 text-dark-brown text-xs font-semibold transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-forest" />
                      <span>URL Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-muted-brown" />
                      <span>Copy Emergency Link</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/profile/${activeToken.token}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-sand" />
                  <span>Open Public Scan View</span>
                </Link>

                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium text-terracotta hover:bg-terracotta/10 border border-terracotta/30 transition-colors disabled:opacity-50"
                >
                  {revoking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Revoke Immediately</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-cream border border-sand flex items-center justify-center text-forest/70 mb-4">
                <QrCode className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-forest">No Active QR Badge</h2>
              <p className="text-xs text-muted-brown mt-2 max-w-xs leading-relaxed">
                Generate a new QR token using the settings form to grant temporary access to first responders.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Generation Controls & Security Directives */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-5"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-xl font-normal text-forest">Generate QR Badge</h2>
            </div>

            <div>
              <label htmlFor="duration" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Token Lifetime
              </label>
              <select
                id="duration"
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              >
                <option value={12}>12 Hours (Short-term)</option>
                <option value={24}>24 Hours (Standard)</option>
                <option value={48}>48 Hours (Weekend / Event)</option>
                <option value={168}>7 Days (1 Week)</option>
                <option value={720}>30 Days (Maximum limit)</option>
              </select>
            </div>

            <div>
              <label htmlFor="badgeLabel" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Badge Label (Optional)
              </label>
              <input
                id="badgeLabel"
                type="text"
                placeholder="e.g. Wallet Card, Medical ID Necklace"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sand" />
                  <span>Generating Token...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 text-sand" />
                  <span>Generate New QR Badge</span>
                </>
              )}
            </button>
          </form>

          {/* Data Minimization Security Notice */}
          <div className="bg-cream/60 rounded-2xl border border-sand/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-dark-brown font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 text-terracotta flex-shrink-0" />
              <span>Data Minimization Guarantee</span>
            </div>
            <p className="text-xs text-muted-brown leading-relaxed">
              Anyone who scans this QR badge will <strong>only</strong> see emergency-vital attributes: your name, blood type, known allergies, chronic conditions, and emergency contacts.
            </p>
            <p className="text-xs text-muted-brown leading-relaxed">
              Your comprehensive consultation history, confidential notes, and sensitive files are <strong>never</strong> exposed through this public emergency view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
