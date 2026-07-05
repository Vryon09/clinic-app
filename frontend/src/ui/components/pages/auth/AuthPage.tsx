import { LoginForm } from "../../forms/LoginForm";
import { SignupForm } from "../../forms/SignupForm";
import { useQuery } from "@tanstack/react-query";
import { handleGetAuthStatus } from "@/services/apiAuth";
import { Spinner } from "../../shadcn/spinner";
import { Button } from "../../shadcn/button";

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        {isAuthStatusPending ? (
          <div className="flex h-screen w-full items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : isAuthError ? (
          <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <p>Backend is not available. Please try again later.</p>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        ) : isSetupComplete ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
