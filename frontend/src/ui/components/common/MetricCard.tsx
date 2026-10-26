import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "../shadcn/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  className?: string;
  progressPercent?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  progressPercent,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground font-sans">
            {value}
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
      </div>

      {(subtitle || trend || progressPercent !== undefined) && (
        <div className="mt-4 space-y-2 border-t border-border/40 pt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            {subtitle && <span>{subtitle}</span>}
            {trend && <span className="font-semibold text-primary">{trend}</span>}
          </div>
          {progressPercent !== undefined && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default MetricCard;
