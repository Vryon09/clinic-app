import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

type RegisterPayload = {
  username: string;
  password: string;
  licenseNum: string;
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
        toast.success("Registered successfully", { position: "top-center" });
      },
    },
  );
}

async function handleAddUser({
  username,
  password,
  role,
  licenseNum,
}: RegisterPayload) {
  const res = await api.post("/api/auth/addUser", {
    username,
    password,
    role,
    licenseNum,
  });
  return res.data;
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message: string }>, RegisterPayload>(
    {
      mutationFn: handleAddUser,
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

export async function handleGetDoctors() {
  const res = await api.get("/api/auth/doctors");

  return res.data || [];
}

async function handleUpdateUser({
  id,
  username,
  role,
  licenseNum,
}: {
  username: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  id: string;
  licenseNum: string;
}) {
  const res = await api.patch("/api/auth/update", {
    id,
    username,
    role,
    licenseNum,
  });

  return res.data || {};
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      username: string;
      role: "ADMIN" | "DOCTOR" | "ASSISTANT";
      id: string;
      licenseNum: string;
    }
  >({
    mutationFn: handleUpdateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully", { position: "top-center" });
    },
  });
}

async function handleChangePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const res = await api.patch("/api/auth/changePassword", {
    oldPassword,
    newPassword,
  });

  return res.data || {};
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      oldPassword: string;
      newPassword: string;
    }
  >({
    mutationFn: handleChangePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated password successfully", {
        position: "top-center",
      });
    },
  });
}

async function handleChangeLicenseNum({ licenseNum }: { licenseNum: string }) {
  const res = await api.patch("/api/auth/changeLicenseNum", {
    licenseNum,
  });

  return res.data || {};
}

export function useChangeLicenseNum() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      licenseNum: string;
    }
  >({
    mutationFn: handleChangeLicenseNum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("User updated License Number successfully", {
        position: "top-center",
      });
    },
  });
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

async function handleToggleUserStatus({ id }: { id: string }) {
  const res = await api.patch("/api/auth/toggleStatus", { id });

  return res.data || {};
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleToggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
