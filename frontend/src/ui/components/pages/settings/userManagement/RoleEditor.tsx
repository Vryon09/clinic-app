import { useMemo, useState } from "react";
import { Edit, Lock, RotateCcw, Save, ShieldCheck, Trash2 } from "lucide-react";
import type { FeatureKey, FeatureState } from "@/lib/features";
import type { IRole, IRoleCatalog } from "@/types/RoleType";
import {
  useDeleteRole,
  useUpdateRoleFeatures,
  useUpdateRolePermissions,
} from "@/services/apiRoles";
import { cn } from "@/lib/utils";
import { Button } from "../../../shadcn/button";
import { Badge } from "../../../shadcn/badge";
import { Separator } from "../../../shadcn/separator";
import ConfirmDialog from "../../../common/ConfirmDialog";
import RoleFormDialog from "./RoleFormDialog";

const FEATURE_STATES: { value: FeatureState; label: string }[] = [
  { value: "ENABLED", label: "Enabled" },
  { value: "DISABLED", label: "Disabled" },
  { value: "HIDDEN", label: "Hidden" },
];

const STATE_RANK: Record<FeatureState, number> = {
  ENABLED: 0,
  DISABLED: 1,
  HIDDEN: 2,
};

function RoleEditor({
  role,
  catalog,
}: {
  role: IRole;
  catalog: IRoleCatalog;
}) {
  const isSuperAdmin = role.key === "SUPER_ADMIN";

  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    () => new Set(role.permissions),
  );
  const [features, setFeatures] = useState<Record<FeatureKey, FeatureState>>(
    () => ({ ...role.features }),
  );
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: savePerms, isPending: isSavingPerms } =
    useUpdateRolePermissions();
  const { mutate: saveFeatures, isPending: isSavingFeatures } =
    useUpdateRoleFeatures();
  const { mutate: deleteRole, isPending: isDeletingRole } = useDeleteRole();

  const permsDirty = useMemo(() => {
    if (selectedPerms.size !== role.permissions.length) return true;
    return role.permissions.some((p) => !selectedPerms.has(p));
  }, [selectedPerms, role.permissions]);

  const featuresDirty = useMemo(() => {
    return catalog.features.some(
      (f) => (features[f.key] ?? "ENABLED") !== (role.features[f.key] ?? "ENABLED"),
    );
  }, [features, role.features, catalog.features]);

  const togglePerm = (key: string) => {
    if (isSuperAdmin) return;
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (keys: string[]) => {
    if (isSuperAdmin) return;
    const allSelected = keys.every((k) => selectedPerms.has(k));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      for (const k of keys) {
        if (allSelected) next.delete(k);
        else next.add(k);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">{role.name}</h3>
            <Badge variant="outline" className="text-[10px]">
              {role.key}
            </Badge>
            {role.isSystem && (
              <Badge variant="secondary" className="text-[10px]">
                System
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {role.description || "No description provided."}
          </p>
        </div>

        {!isSuperAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-lg text-xs cursor-pointer"
              onClick={() => setIsEditingMeta(true)}
            >
              <Edit className="size-3.5" /> Edit Info
            </Button>
            {!role.isSystem && (
              <Button
                size="sm"
                variant="destructive"
                className="h-8 gap-1.5 rounded-lg text-xs cursor-pointer"
                onClick={() => setIsDeleting(true)}
                disabled={isDeletingRole}
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {isSuperAdmin && (
        <div className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs text-foreground">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>
            Super Administrator always has full access to all features,
            permissions, and User Management. This role cannot be restricted or
            modified.
          </span>
        </div>
      )}

      {/* Feature Access Matrix */}
      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Feature Access
            </h4>
            <p className="text-xs text-muted-foreground">
              <strong>Enabled</strong> = full access ·{" "}
              <strong>Disabled</strong> = visible but read-only ·{" "}
              <strong>Hidden</strong> = removed from UI & blocked
            </p>
          </div>
          {!isSuperAdmin && (
            <div className="flex items-center gap-2">
              {featuresDirty && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 text-xs cursor-pointer"
                  onClick={() => setFeatures({ ...role.features })}
                >
                  <RotateCcw className="size-3" /> Reset
                </Button>
              )}
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                disabled={!featuresDirty || isSavingFeatures}
                onClick={() => saveFeatures({ id: role.id, features })}
              >
                <Save className="size-3.5" /> Save Features
              </Button>
            </div>
          )}
        </div>

        <Separator className="bg-border/60" />

        <div className="divide-y divide-border/60">
          {catalog.features.map((f) => {
            const parentState = f.parent
              ? features[f.parent] ?? "ENABLED"
              : "ENABLED";
            const ownState = features[f.key] ?? "ENABLED";
            const isOverriddenByParent =
              !!f.parent && STATE_RANK[parentState] > STATE_RANK[ownState];

            return (
              <div
                key={f.key}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5",
                  f.parent && "pl-6",
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium text-foreground">
                    {f.parent ? `↳ ${f.label}` : f.label}
                  </span>
                  {isOverriddenByParent && (
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      <Lock className="size-2.5" />
                      Parent is {parentState.toLowerCase()}
                    </span>
                  )}
                </div>

                <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5 self-start sm:self-auto">
                  {FEATURE_STATES.map((opt) => {
                    const active = ownState === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isSuperAdmin}
                        onClick={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            [f.key]: opt.value,
                          }))
                        }
                        className={cn(
                          "px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed",
                          active
                            ? opt.value === "HIDDEN"
                              ? "bg-destructive text-destructive-foreground shadow-2xs"
                              : opt.value === "DISABLED"
                                ? "bg-amber-500 text-white shadow-2xs"
                                : "bg-primary text-primary-foreground shadow-2xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Permissions
            </h4>
            <p className="text-xs text-muted-foreground">
              Fine-grained action permissions granted to this role.
            </p>
          </div>
          {!isSuperAdmin && (
            <div className="flex items-center gap-2">
              {permsDirty && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 text-xs cursor-pointer"
                  onClick={() => setSelectedPerms(new Set(role.permissions))}
                >
                  <RotateCcw className="size-3" /> Reset
                </Button>
              )}
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                disabled={!permsDirty || isSavingPerms}
                onClick={() =>
                  savePerms({
                    id: role.id,
                    permissions: Array.from(selectedPerms),
                  })
                }
              >
                <Save className="size-3.5" /> Save Permissions
              </Button>
            </div>
          )}
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-5">
          {catalog.permissionGroups.map((group) => {
            const keys = group.items.map((i) => i.key);
            const allChecked = keys.every((k) => selectedPerms.has(k));

            return (
              <div key={group.group} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {group.group}
                  </h5>
                  {!isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(keys)}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {allChecked ? "Unselect all" : "Select all"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.items.map((item) => {
                    const checked = selectedPerms.has(item.key);
                    return (
                      <label
                        key={item.key}
                        className={cn(
                          "flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors",
                          checked
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/70 bg-background",
                          !isSuperAdmin && "cursor-pointer hover:bg-muted/30",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-3.5 accent-primary cursor-pointer"
                          checked={checked}
                          disabled={isSuperAdmin}
                          onChange={() => togglePerm(item.key)}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-tight">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RoleFormDialog
        open={isEditingMeta}
        onOpenChange={setIsEditingMeta}
        editingRole={role}
      />

      <ConfirmDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Custom Role?"
        description={`Are you sure you want to delete "${role.name}"? This cannot be undone.`}
        confirmLabel="Delete Role"
        onConfirm={() => {
          deleteRole(role.id);
          setIsDeleting(false);
        }}
      />
    </div>
  );
}

export default RoleEditor;
