import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Separator } from "../../shadcn/separator";

import { useQuery } from "@tanstack/react-query";
import { handleGetUsers } from "@/services/apiAuth";
import type { IUser } from "@/types/User";
import UsersTable from "./UsersTable";
import { useState } from "react";
import UserDialog from "./UserDialog";
import { useAuth } from "@/hooks/useAuth";
import PasswordDialog from "./PasswordDialog";

function ManageAccounts() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const { data: users, isPending: isUsersLoading } = useQuery<IUser[]>({
    queryFn: handleGetUsers,
    queryKey: ["users"],
  });

  const { user, isUserLoading } = useAuth();

  if (isUsersLoading || isUserLoading) return <p>Loading...</p>;

  console.log(user);

  return (
    <Card className="space-y-4 px-8 py-4">
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-semibold">Manage Accounts</p>
          <p className="text-sm text-neutral-500">
            Create and manage user access for your clinic
          </p>
        </div>

        <Button
          className="cursor-pointer"
          onClick={() => setIsAddingUser((prev) => !prev)}
        >
          <Plus /> Add User
        </Button>

        <UserDialog
          isUserDialogOpen={isAddingUser}
          setIsUserDialogOpen={setIsAddingUser}
          action="create"
          initialValues={{
            username: "",
            role: "DOCTOR",
            id: "",
            isActive: true,
          }}
        />
      </div>

      <Separator />

      <UsersTable
        users={users!}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <Separator />

      <div>
        <p className="text-2xl font-semibold">Manage Profile</p>
        <p className="text-sm text-neutral-500">
          Update your account information
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => {
            setIsChangingPassword(true);
          }}
        >
          Change Password
        </Button>

        <PasswordDialog
          open={isChangingPassword}
          onOpenChange={setIsChangingPassword}
        />
      </div>
    </Card>
  );
}

export default ManageAccounts;
