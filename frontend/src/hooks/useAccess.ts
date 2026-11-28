import type { FeatureKey, FeatureState } from "@/lib/features";
import { useAuth } from "./useAuth";

export function useAccess() {
  const { user, isUserLoading } = useAuth();

  const isSuperAdmin = !!user?.isSuperAdmin || user?.role === "SUPER_ADMIN";

  const can = (permission: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return user.permissions?.includes(permission) ?? false;
  };

  const featureState = (key: FeatureKey): FeatureState => {
    if (!user) return "ENABLED";
    if (isSuperAdmin) return "ENABLED";
    return user.features?.[key] ?? "ENABLED";
  };

  const isHidden = (key: FeatureKey): boolean =>
    featureState(key) === "HIDDEN";

  const isReadOnly = (key: FeatureKey): boolean =>
    featureState(key) === "DISABLED";

  return {
    user,
    isUserLoading,
    isSuperAdmin,
    can,
    featureState,
    isHidden,
    isReadOnly,
  };
}
