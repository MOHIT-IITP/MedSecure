import React from "react";

export function Label({
  children,
  className = "",
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold tracking-tight text-slate-700 uppercase mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1 font-bold">*</span>}
    </label>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
}

export function Input({ error, helperText, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 shadow-2xs outline-none ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
}

export function Textarea({ error, helperText, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        {...props}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 shadow-2xs outline-none ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function Select({ error, className = "", children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      <select
        {...props}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 shadow-2xs outline-none ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        } disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
