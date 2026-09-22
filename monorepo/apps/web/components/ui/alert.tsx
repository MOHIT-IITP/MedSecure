import React from "react";
import { AlertCircle, CheckCircle2 } from "./icons";

export function Alert({
  children,
  tone = "error",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "error" | "success" | "warning" | "info";
  className?: string;
}) {
  const styles = {
    error: "bg-red-50 text-red-800 border-red-200/80",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80",
    info: "bg-blue-50 text-blue-800 border-blue-200/80",
  }[tone];

  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs font-medium leading-relaxed ${styles} ${className}`}
    >
      <Icon className="mt-0.5 shrink-0" size={15} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
