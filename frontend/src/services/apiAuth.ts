import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { IUser } from "@/types/User";

type RegisterPayload = {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  password: string;
  licenseNum: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
};

type LoginPayload = {
  username: string;
  password: string;
};

async function handleRegister({
  username,
  password,
  role,
  firstName,
  middleName,
  lastName,
}: RegisterPayload) {
  const res = await api.post("/api/auth/register", {
    username,
    password,
    role,
    firstName,
    middleName,
    lastName,
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
        toast.success("Registration Successful", {
          description: "Administrator account created. You can now log in.",
        });
      },
      onError: (error) => {
        toast.error("Registration Failed", {
          description:
            error?.response?.data?.message ||
            "Could not complete account registration.",
        });
      },
    },
  );
}

async function handleAddUser({
  username,
  password,
  role,
  licenseNum,
  firstName,
  middleName,
  lastName,
}: RegisterPayload) {
  const res = await api.post("/api/auth/addUser", {
    username,
    password,
    role,
    licenseNum,
    firstName,
    middleName,
    lastName,
  });
  return res.data;
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message: string }>, RegisterPayload>(
    {
      mutationFn: handleAddUser,
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("Staff Account Created", {
          description: `User account for "${variables.username}" (${variables.role}) created successfully.`,
        });
      },
      onError: (error) => {
        toast.error("Failed to Create Account", {
          description:
            error?.response?.data?.message ||
            "Could not create user account.",
        });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Account Details Updated", {
        description: `Settings updated for "${variables.username}".`,
      });
    },
    onError: (error) => {
      toast.error("Failed to Update Account", {
        description:
          error?.response?.data?.message || "Could not update user account.",
      });
    },
  });
}

async function handleUpdateUsername({ username }: { username: string }) {
  const res = await api.patch("/api/auth/changeUsername", {
    username,
  });

  return res.data || {};
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { username: string }
  >({
    mutationFn: handleUpdateUsername,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Username Changed", {
        description: `Your username has been updated to "${variables.username}".`,
      });
    },
    onError: (error) => {
      toast.error("Failed to Change Username", {
        description:
          error?.response?.data?.message || "Could not update username.",
      });
    },
  });
}

async function handleUpdateFullName({
  firstName,
  middleName,
  lastName,
}: {
  firstName: string;
  middleName: string;
  lastName: string;
}) {
  const res = await api.patch("/api/auth/changeFullName", {
    firstName,
    middleName,
    lastName,
  });

  return res.data || {};
}

export function useUpdateFullName() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      firstName: string;
      middleName: string;
      lastName: string;
    }
  >({
    mutationFn: handleUpdateFullName,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      const currentUser = queryClient.getQueryData<IUser>(["me"]);
      const prefix = currentUser?.role === "DOCTOR" ? "Dr. " : "";
      toast.success("Profile Name Updated", {
        description: `Name updated to ${prefix}${variables.firstName} ${variables.lastName}.`,
      });
    },
    onError: (error) => {
      toast.error("Failed to Update Name", {
        description:
          error?.response?.data?.message || "Could not update profile name.",
      });
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
      toast.success("Password Updated", {
        description: "Your account password has been changed successfully.",
      });
    },
    onError: (error) => {
      toast.error("Password Change Failed", {
        description:
          error?.response?.data?.message ||
          "Could not change password. Please verify current password.",
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("License Number Updated", {
        description: `Medical license number set to "${variables.licenseNum}".`,
      });
    },
    onError: (error) => {
      toast.error("Failed to Update License Number", {
        description:
          error?.response?.data?.message || "Could not update license number.",
      });
    },
  });
}

async function handleLogin({ username, password }: LoginPayload) {
  const res = await api.post("/api/auth/login", { username, password });

  localStorage.setItem("token", res.data.data.token);

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
      localStorage.removeItem("token");
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      toast.info("Logged Out", {
        description: "You have been logged out of the application.",
      });
    },
    onError: (error: any) => {
      toast.error("Logout Failed", {
        description: error?.response?.data?.message || "Could not log out.",
      });
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

  return useMutation<unknown, AxiosError<{ message: string }>, { id: string }>({
    mutationFn: handleToggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Access Updated", {
        description: "Staff account status has been updated.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Update Access", {
        description:
          error?.response?.data?.message ||
          "Could not update user account status.",
      });
    },
  });
}
