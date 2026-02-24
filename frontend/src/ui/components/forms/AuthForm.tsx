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
        "flex min-h-screen items-center justify-center bg-slate-50 p-4",
      )}
    >
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">ClinicFlow</h1>
          <p className="text-slate-500">Management System</p>
        </div>

        {children}
      </div>
    </div>
  );
}
