import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type RegisterPayload = {
  username: string;
  password: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
};

type LoginPayload = {
  username: string;
  password: string;
};

async function handleRegister({ username, password, role }: RegisterPayload) {
  const res = await api.post("/api/auth/register", {
    username,
    password,
    role,
  });
  return res.data;
}

export function useRegister() {
  return useMutation<unknown, AxiosError<{ message: string }>, RegisterPayload>(
    { mutationFn: handleRegister },
  );
}

export async function handleGetAuthStatus() {
  const res = await api.get("/api/auth/status");

  return res.data;
}

async function handleLogin({ username, password }: LoginPayload) {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message: string }>, LoginPayload>({
    mutationFn: handleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

async function handleLogout() {
  await api.post("/api/auth/logout");
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}

export async function handleGetMe() {
  const res = await api.get("/api/auth/me");

  return res.data;
}
