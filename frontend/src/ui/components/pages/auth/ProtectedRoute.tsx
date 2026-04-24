import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { Spinner } from "../../shadcn/spinner";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  if (!user) return <Navigate to="/auth" />;

  return children;
}

export default ProtectedRoute;
