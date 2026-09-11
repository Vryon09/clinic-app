import { LoginForm } from "../../forms/LoginForm";
import { useQuery } from "@tanstack/react-query";
import { handleGetAuthStatus } from "@/services/apiAuth";
import { Spinner } from "../../shadcn/spinner";
import { Button } from "../../shadcn/button";
import WelcomeScreen from "./WelcomeScreen";

import { AlertCircle, RefreshCw } from "lucide-react";

function AuthPage() {
  const {
    data: authStatusData,
    isPending: isAuthStatusPending,
    isError: isAuthError,
  } = useQuery({
    queryFn: handleGetAuthStatus,
    queryKey: ["authStatus"],
    retry: false,
  });

  const isSetupComplete = authStatusData?.isSetupComplete || false;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-8 sm:px-6 md:px-10">
      {/* Soft ambient background element */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20">
        <div className="h-[450px] w-[450px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {isAuthStatusPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-card border border-border/80 shadow-xs">
              <Spinner className="size-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground tracking-tight">ClinicSync</p>
              <p className="text-xs text-muted-foreground mt-0.5">Connecting to clinical service...</p>
            </div>
          </div>
        ) : isAuthError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Service Unavailable</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground max-w-xs">
              The clinic application backend is currently unreachable. Please check your connection or restart the service.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 gap-2 rounded-lg font-medium cursor-pointer"
              onClick={() => {
                window.location.reload();
              }}
            >
              <RefreshCw className="size-3.5" />
              Retry Connection
            </Button>
          </div>
        ) : isSetupComplete ? (
          <LoginForm />
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
