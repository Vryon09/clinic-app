import { cn } from "@/lib/utils";

import { type ReactNode } from "react";

interface LoginFormProps {
  switchMode: () => void;
  children: ReactNode;
}

export function AuthForm({ children }: LoginFormProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4 sm:p-6",
      )}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">ClinicSync</h1>
          <p className="text-xs text-muted-foreground">Clinical Operating System</p>
        </div>

        {children}
      </div>
    </div>
  );
}
