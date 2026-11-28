import { useState } from "react";
import { useCreateRole, useUpdateRole } from "@/services/apiRoles";
import type { IRole } from "@/types/RoleType";
import { Button } from "../../../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/dialog";
import { Input } from "../../../shadcn/input";
import { Label } from "../../../shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shadcn/select";

function RoleFormInner({
  onOpenChange,
  roles,
  editingRole,
}: {
  onOpenChange: (open: boolean) => void;
  roles: IRole[];
  editingRole?: IRole;
}) {
  const [name, setName] = useState(editingRole?.name || "");
  const [description, setDescription] = useState(
    editingRole?.description || "",
  );
  const [cloneFromRoleId, setCloneFromRoleId] = useState<string>("none");

  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingRole) {
      updateRole(
        { id: editingRole.id, name: name.trim(), description: description.trim() },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createRole(
        {
          name: name.trim(),
          description: description.trim(),
          cloneFromRoleId:
            cloneFromRoleId !== "none" ? cloneFromRoleId : undefined,
        },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="role-name" className="text-xs font-semibold">
          Role Name
        </Label>
        <Input
          id="role-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Receptionist"
          maxLength={40}
          required
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role-desc" className="text-xs font-semibold">
          Description (optional)
        </Label>
        <Input
          id="role-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short summary of this role"
          maxLength={200}
          className="h-9 text-sm"
        />
      </div>

      {!editingRole && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            Copy permissions from
          </Label>
          <Select
            value={cloneFromRoleId}
            onValueChange={setCloneFromRoleId}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Start blank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Start blank</SelectItem>
              {roles
                .filter((r) => r.key !== "SUPER_ADMIN")
                .map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-lg"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isCreating || isUpdating || !name.trim()}
          className="h-9 rounded-lg font-semibold"
        >
          {editingRole ? "Save Changes" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}

function RoleFormDialog({
  open,
  onOpenChange,
  roles = [],
  editingRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles?: IRole[];
  editingRole?: IRole;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/80 rounded-2xl p-6 shadow-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {editingRole ? "Edit Role" : "Create Custom Role"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <RoleFormInner
            key={editingRole?.id ?? "new"}
            onOpenChange={onOpenChange}
            roles={roles}
            editingRole={editingRole}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RoleFormDialog;
