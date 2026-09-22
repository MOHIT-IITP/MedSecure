import React from "react";
import { Badge } from "./badge";

export function StatCard({
  title,
  value,
  unit,
  subtitle,
  status = "neutral",
  statusLabel,
  icon: Icon,
  className = "",
}: {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  status?: "neutral" | "success" | "warning" | "error" | "info";
  statusLabel?: string;
  icon?: React.ComponentType<{ className?: string; size?: number | string }>;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-tight uppercase text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="text-slate-400">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
        {statusLabel && (
          <Badge variant={status} size="sm">
            {statusLabel}
          </Badge>
        )}
      </div>
    </div>
  );
}
