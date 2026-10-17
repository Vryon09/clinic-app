import { useAuth } from "@/hooks/useAuth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "../../shadcn/spinner";
import { useQuery } from "@tanstack/react-query";
import {
  handleGetClinicInfo,
  useInitClinicInfo,
} from "@/services/apiClinicInfo";
import { AppLogo } from "../../common/AppLogo";

function AuthGate({ children }: { children: ReactNode }) {
  const {
    data: clinicInfo,
    isPending: isClinicInfoPending,
    isError: isClinicInfoError,
  } = useQuery({
    queryFn: handleGetClinicInfo,
    queryKey: ["clinicInfo"],
    retry: false,
  });

  const { user, isUserLoading } = useAuth();

  const { mutate: handleInitClinicInfo, isPending: isInitClinicInfoLoading } =
    useInitClinicInfo();

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoading || isClinicInfoPending) return;

    if (isClinicInfoError || !clinicInfo) {
      handleInitClinicInfo();
    }

    if (user) {
      navigate("/patients");
    }
  }, [
    user,
    navigate,
    isUserLoading,
    clinicInfo,
    isClinicInfoPending,
    handleInitClinicInfo,
    isClinicInfoError,
  ]);

  if (isUserLoading || isClinicInfoPending || isInitClinicInfoLoading)
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-3">
          <AppLogo variant="icon" className="size-16" />
          <Spinner className="size-5 text-primary" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground tracking-tight">ClinicSync</p>
            <p className="text-xs text-muted-foreground">Authenticating session...</p>
          </div>
        </div>
      </div>
    );

  return children;
}

export default AuthGate;
