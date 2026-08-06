import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function handleResetDatabase() {
  await api.delete("/api/system/reset");
}

export function useResetDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleResetDatabase,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}
