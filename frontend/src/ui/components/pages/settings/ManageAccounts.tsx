import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Separator } from "../../shadcn/separator";

import { useQuery } from "@tanstack/react-query";
import { handleGetUsers } from "@/services/apiAuth";
import type { IUser } from "@/types/User";
import UsersTable from "./UsersTable";

function ManageAccounts() {
  const { data: users, isPending: isUsersLoading } = useQuery<IUser[]>({
    queryFn: handleGetUsers,
    queryKey: ["users"],
  });

  if (isUsersLoading) return <p>Loading...</p>;

  return (
    <Card className="space-y-4 px-8 py-4">
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-semibold">Manage Accounts</p>
          <p className="text-sm text-neutral-500">
            Create and manage user access for your clinic
          </p>
        </div>

        <Button className="cursor-pointer">
          <Plus /> Add User
        </Button>
      </div>

      <Separator />

      <UsersTable users={users!} />
    </Card>
  );
}

export default ManageAccounts;
