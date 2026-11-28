import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { handleGetUsers } from "@/services/apiAuth";
import type { IUser } from "@/types/User";
import { Button } from "../../../shadcn/button";
import { Spinner } from "../../../shadcn/spinner";
import UsersTable from "../accounts/UsersTable";
import UserDialog from "./UserDialog";

function UsersPanel() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const { data: users = [], isPending } = useQuery<IUser[]>({
    queryFn: handleGetUsers,
    queryKey: ["users"],
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Staff Accounts
          </h3>
          <p className="text-xs text-muted-foreground">
            Create, update, or deactivate staff accounts and assign their roles.
          </p>
        </div>

        <Button
          size="sm"
          className="gap-1.5 h-9 rounded-lg font-semibold shadow-xs cursor-pointer"
          onClick={() => setIsAddingUser(true)}
          disabled={isPending}
        >
          <Plus className="size-4" /> Add User
        </Button>
      </div>

      {isPending ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-7 text-primary" />
        </div>
      ) : (
        <UsersTable users={users} onEditUser={(u) => setEditingUser(u)} />
      )}

      <UserDialog
        isUserDialogOpen={isAddingUser}
        setIsUserDialogOpen={setIsAddingUser}
        action="create"
        initialValues={{
          id: "",
          username: "",
          role: "DOCTOR",
          licenseNum: "",
          isActive: true,
          firstName: "",
          middleName: "",
          lastName: "",
        }}
      />

      {editingUser && (
        <UserDialog
          key={editingUser.id}
          isUserDialogOpen={!!editingUser}
          setIsUserDialogOpen={(open) => {
            if (!open) setEditingUser(null);
          }}
          action="update"
          initialValues={editingUser}
        />
      )}
    </div>
  );
}

export default UsersPanel;
