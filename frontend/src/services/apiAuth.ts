import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message: string }>, RegisterPayload>(
    {
      mutationFn: handleRegister,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User added successfully", { position: "top-center" });
      },
    },
  );
}

export async function handleGetAuthStatus() {
  const res = await api.get("/api/auth/status");

  return res.data;
}

export async function handleGetUsers() {
  const res = await api.get("/api/auth/users");

  return res.data || [];
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
