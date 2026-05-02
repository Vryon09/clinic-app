import { useAuth } from "@/hooks/useAuth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "../../shadcn/spinner";
import { useQuery } from "@tanstack/react-query";
import {
  handleGetClinicInfo,
  useInitClinicInfo,
} from "@/services/apiClinicInfo";

function AuthGate({ children }: { children: ReactNode }) {
  const { data: clinicInfo, isPending: isClinicInfoPending } = useQuery({
    queryFn: handleGetClinicInfo,
    queryKey: ["clinicInfo"],
  });

  const { user, isUserLoading } = useAuth();

  const { mutate: handleInitClinicInfo, isPending: isInitClinicInfoLoading } =
    useInitClinicInfo();

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoading || isClinicInfoPending) return;

    if (!clinicInfo) {
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
  ]);

  if (isUserLoading || isClinicInfoPending || isInitClinicInfoLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return children;
}

export default AuthGate;
