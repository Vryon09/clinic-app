import { useAuth } from "@/hooks/useAuth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "../../shadcn/spinner";

function AuthGate({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLoading) return;

    if (user) {
      navigate("/patients");
    }
  }, [user, navigate, isUserLoading]);

  if (isUserLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return children;
}

export default AuthGate;
