import React from "react";
import labCoatImg from "@/ui/assets/images/lab_coat.png";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  showMascot?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
  className,
  showMascot = true,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center sm:p-12",
        className
      )}
    >
      {showMascot ? (
        <div className="relative mb-4 flex size-20 items-center justify-center rounded-2xl bg-primary/5 p-3 ring-1 ring-primary/20">
          <img
            src={labCoatImg}
            alt="Clinic mascot"
            className="size-14 object-contain drop-shadow-xs"
          />
        </div>
      ) : Icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <Icon className="size-6" />
        </div>
      ) : null}

      <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
