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
    bg: "bg-emerald-500/8 dark:bg-emerald-950/25 border-emerald-600/20 dark:border-emerald-500/20",
    text: "text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-600/80",
  },
  warning: {
    bg: "bg-amber-500/8 dark:bg-amber-950/25 border-amber-600/20 dark:border-amber-500/20",
    text: "text-amber-800 dark:text-amber-300",
    dot: "bg-amber-600/80",
  },
  danger: {
    bg: "bg-rose-500/8 dark:bg-rose-950/25 border-rose-600/20 dark:border-rose-500/20",
    text: "text-rose-800 dark:text-rose-300",
    dot: "bg-rose-600/80",
  },
  info: {
    bg: "bg-slate-500/8 dark:bg-slate-900/30 border-slate-500/20 dark:border-slate-400/20",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-500/80",
  },
  neutral: {
    bg: "bg-muted/50 border-border/80",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/60",
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
