import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface StatusBadgeProps {
  status?: string;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<
  StatusVariant,
  { bg: string; text: string; dot: string }
> = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  info: {
    bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-800/40",
    text: "text-teal-700 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  neutral: {
    bg: "bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40",
    text: "text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

export function StatusBadge({
  status,
  variant = "neutral",
  className,
  dot = true,
  children,
}: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors",
        styles.bg,
        styles.text,
        className
      )}
    >
      {dot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0", styles.dot)}
          aria-hidden="true"
        />
      )}
      <span>{children ?? status}</span>
    </span>
  );
}

export default StatusBadge;
