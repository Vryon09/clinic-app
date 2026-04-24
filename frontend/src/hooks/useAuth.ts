import { handleGetMe } from "@/services/apiAuth";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isPending: isUserLoading } = useQuery({
    queryFn: handleGetMe,
    queryKey: ["me"],
    retry: false,
  });

  return { user, isUserLoading };
}
