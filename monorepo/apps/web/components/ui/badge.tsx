import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-0.5 font-medium",
  }[size];

  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border border-slate-200/60",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/70",
    error: "bg-red-50 text-red-700 border border-red-200/70",
    info: "bg-blue-50 text-blue-700 border border-blue-200/70",
    outline: "bg-transparent text-slate-600 border border-slate-200",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
