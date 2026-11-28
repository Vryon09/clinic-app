import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { EyeOff } from "lucide-react";
import { useAccess } from "@/hooks/useAccess";
import type { FeatureKey } from "@/lib/features";

const FALLBACK_MODULES: { key: FeatureKey; path: string }[] = [
  { key: "dashboard", path: "/dashboard" },
  { key: "patients", path: "/patients" },
  { key: "billing", path: "/billing" },
];

export function FeatureRoute({
  feature,
  children,
}: {
  feature: FeatureKey;
  children: ReactNode;
}) {
  const { isHidden, isUserLoading } = useAccess();

  if (isUserLoading) return null;

  if (isHidden(feature)) {
    const fallback =
      FALLBACK_MODULES.find((m) => m.key !== feature && !isHidden(m.key))
        ?.path ?? "/settings";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

export function ReadOnlyNotice({
  feature,
  label,
}: {
  feature: FeatureKey;
  label?: string;
}) {
  const { isReadOnly } = useAccess();
  if (!isReadOnly(feature)) return null;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
      <EyeOff className="size-4 shrink-0" />
      <span>
        <strong>Read-only mode:</strong> {label || "This section"} has been
        disabled by the Super Admin for your role. You can view data, but
        creating or modifying records is disabled.
      </span>
    </div>
  );
}
