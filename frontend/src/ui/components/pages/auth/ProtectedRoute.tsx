import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { Spinner } from "../../shadcn/spinner";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading)
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Spinner className="size-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground tracking-tight">ClinicSync</p>
            <p className="text-xs text-muted-foreground">Verifying access credentials...</p>
          </div>
        </div>
      </div>
    );

  if (!user) return <Navigate to="/auth" />;

  return children;
}

export default ProtectedRoute;
