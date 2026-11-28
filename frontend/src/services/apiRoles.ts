import api from "@/lib/api";
import type { FeatureKey, FeatureState } from "@/lib/features";
import type { IRole, IRoleCatalog } from "@/types/RoleType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export function useRoleCatalog(enabled = true) {
  return useQuery<IRoleCatalog>({
    queryKey: ["roleCatalog"],
    queryFn: async () => {
      const res = await api.get("/api/roles/catalog");
      return res.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoles(enabled = true) {
  return useQuery<IRole[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/api/roles");
      return res.data;
    },
    enabled,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation<
    IRole,
    AxiosError<{ message: string }>,
    { name: string; description?: string; cloneFromRoleId?: string }
  >({
    mutationFn: async (payload) => {
      const res = await api.post("/api/roles", payload);
      return res.data;
    },
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Role Created", {
        description: `Custom role "${role.name}" has been created.`,
      });
    },
    onError: (err) => {
      toast.error("Failed to Create Role", {
        description: err.response?.data?.message || "Could not create role.",
      });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation<
    IRole,
    AxiosError<{ message: string }>,
    { id: string; name: string; description?: string }
  >({
    mutationFn: async ({ id, ...body }) => {
      const res = await api.patch(`/api/roles/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Role Updated");
    },
    onError: (err) => {
      toast.error("Failed to Update Role", {
        description: err.response?.data?.message || "Could not update role.",
      });
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { id: string; permissions: string[] }
  >({
    mutationFn: async ({ id, permissions }) => {
      const res = await api.put(`/api/roles/${id}/permissions`, { permissions });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Permissions Saved", {
        description: "Role permissions updated.",
      });
    },
    onError: (err) => {
      toast.error("Failed to Save Permissions", {
        description:
          err.response?.data?.message || "Could not update permissions.",
      });
    },
  });
}

export function useUpdateRoleFeatures() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    { id: string; features: Record<FeatureKey, FeatureState> }
  >({
    mutationFn: async ({ id, features }) => {
      const res = await api.put(`/api/roles/${id}/features`, { features });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Feature Access Saved", {
        description: "Feature visibility and access updated.",
      });
    },
    onError: (err) => {
      toast.error("Failed to Save Feature Access", {
        description:
          err.response?.data?.message || "Could not update feature access.",
      });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<{ message: string }>, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/roles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role Deleted");
    },
    onError: (err) => {
      toast.error("Cannot Delete Role", {
        description: err.response?.data?.message || "Could not delete role.",
      });
    },
  });
}
