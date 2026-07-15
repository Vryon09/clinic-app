import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shadcn/table";
import { Badge } from "../../../shadcn/badge";
import { Button } from "../../../shadcn/button";
import type { IUser } from "@/types/User";
import UserDialog from "./UserDialog";
import { useToggleUserStatus } from "@/services/apiAuth";
import { cn } from "@/lib/utils";
import { Card } from "@/ui/components/shadcn/card";
import { toast } from "sonner";

function UsersTable({
  users,
  selectedUser,
  setSelectedUser,
}: {
  users: IUser[];
  selectedUser: IUser | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}) {
  const { mutate: handleToggleUserStatus } = useToggleUserStatus();

  return (
    <Card className="rounded-xl px-2">
      <Table>
        {users.length === 0 && (
          <TableCaption className="mb-4">No users found.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Username</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>

              <TableCell>
                <Badge>{user.role}</Badge>
              </TableCell>

              <TableCell>
                <Badge
                  className={cn(
                    user.isActive ? "bg-green-500" : "bg-neutral-500",
                  )}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="space-x-2 text-right">
                <Button
                  onClick={() =>
                    setSelectedUser({
                      username: user.username,
                      role: user.role,
                      id: user.id,
                      isActive: user.isActive,
                      licenseNum: user.licenseNum,
                      firstName: user.firstName,
                      middleName: user.middleName,
                      lastName: user.lastName,
                    })
                  }
                  size="xs"
                >
                  Edit
                </Button>

                <Button
                  size="xs"
                  className={cn(
                    !user.isActive && "bg-green-500 hover:bg-green-500/80",
                    "cursor-pointer",
                  )}
                  variant={user.isActive ? "destructive" : "default"}
                  onClick={() =>
                    handleToggleUserStatus(
                      { id: user.id },
                      {
                        onError: (err) => {
                          toast.error(err.response?.data?.message, {
                            position: "top-center",
                          });
                        },
                      },
                    )
                  }
                >
                  {user.isActive ? "Disable" : "Enable"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserDialog
          isUserDialogOpen={!!selectedUser}
          setIsUserDialogOpen={() => {
            if (selectedUser) {
              setSelectedUser(null);
            }
          }}
          action="update"
          initialValues={{
            username: selectedUser!.username,
            role: selectedUser!.role,
            id: selectedUser!.id,
            isActive: selectedUser!.isActive,
            licenseNum: selectedUser!.licenseNum,
            firstName: selectedUser!.firstName,
            middleName: selectedUser!.middleName,
            lastName: selectedUser!.lastName,
          }}
        />
      )}
    </Card>
  );
}

export default UsersTable;
