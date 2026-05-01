import { handleGetMe } from "@/services/apiAuth";
import type { IUser } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isPending: isUserLoading } = useQuery<IUser>({
    queryFn: handleGetMe,
    queryKey: ["me"],
    retry: false,
  });

  return { user, isUserLoading };
}
