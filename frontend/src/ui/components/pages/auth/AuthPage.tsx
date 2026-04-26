import { LoginForm } from "../../forms/LoginForm";
import { SignupForm } from "../../forms/SignupForm";
import { useQuery } from "@tanstack/react-query";
import { handleGetAuthStatus } from "@/services/apiAuth";
import { Spinner } from "../../shadcn/spinner";

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
      <div className="w-full max-w-sm">
        {isAuthStatusPending ? (
          <div className="flex h-screen w-full items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : isAuthError ? (
          <div className="flex h-screen w-full items-center justify-center">
            <p>Backend is not available. Please try again later.</p>
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
