import { useState } from "react";
import { Lock, Plus, ShieldCheck } from "lucide-react";
import { useRoleCatalog, useRoles } from "@/services/apiRoles";
import type { IRole } from "@/types/RoleType";
import { cn } from "@/lib/utils";
import { Button } from "../../../shadcn/button";
import { Badge } from "../../../shadcn/badge";
import { Spinner } from "../../../shadcn/spinner";
import RoleEditor from "./RoleEditor";
import RoleFormDialog from "./RoleFormDialog";

function RolesPanel() {
  const { data: roles = [], isPending: isRolesLoading } = useRoles();
  const { data: catalog, isPending: isCatalogLoading } = useRoleCatalog();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  if (isRolesLoading || isCatalogLoading || !catalog) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner className="size-7 text-primary" />
      </div>
    );
  }

  const selectedRole: IRole | undefined =
    roles.find((r) => r.id === selectedRoleId) ??
    roles.find((r) => r.key !== "SUPER_ADMIN") ??
    roles[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Roles</h3>
            <p className="text-xs text-muted-foreground">
              Select a role to configure access
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            onClick={() => setIsCreatingRole(true)}
          >
            <Plus className="size-3.5" /> New Role
          </Button>
        </div>

        <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/20 p-2">
          {roles.map((role) => {
            const isSelected = role.id === selectedRole?.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "hover:bg-muted/70 text-foreground",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {role.key === "SUPER_ADMIN" ? (
                      <ShieldCheck className="size-3.5 shrink-0" />
                    ) : role.isSystem ? (
                      <Lock className="size-3 shrink-0 opacity-70" />
                    ) : null}
                    <span className="text-xs font-semibold truncate">
                      {role.name}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-[10px] truncate mt-0.5",
                      isSelected
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {role.userCount}{" "}
                    {role.userCount === 1 ? "user" : "users"}
                    {role.isSystem ? " · System" : " · Custom"}
                  </p>
                </div>
                {role.isSystem && (
                  <Badge
                    variant={isSelected ? "secondary" : "outline"}
                    className="text-[10px] px-1.5 py-0 shrink-0"
                  >
                    {role.key}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selectedRole ? (
          <RoleEditor
            key={selectedRole.id}
            role={selectedRole}
            catalog={catalog}
          />
        ) : (
          <div className="rounded-xl border border-border/80 p-8 text-center text-xs text-muted-foreground">
            Select a role to view and edit its permissions.
          </div>
        )}
      </div>

      <RoleFormDialog
        open={isCreatingRole}
        onOpenChange={setIsCreatingRole}
        roles={roles}
      />
    </div>
  );
}

export default RolesPanel;
