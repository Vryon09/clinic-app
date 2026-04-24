import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type RegisterPayload = {
  username: string;
  password: string;
};

async function handleRegister({ username, password }: RegisterPayload) {
  const res = await api.post("/api/auth/register", { username, password });
  return res.data;
}

export function useRegister() {
  return useMutation<unknown, AxiosError<{ message: string }>, RegisterPayload>(
    { mutationFn: handleRegister },
  );
}
