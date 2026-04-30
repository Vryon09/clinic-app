import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { Badge } from "../../shadcn/badge";
import { Button } from "../../shadcn/button";
import type { IUser } from "@/types/User";
import UserDialog from "./UserDialog";
import { useToggleUserStatus } from "@/services/apiAuth";
import { cn } from "@/lib/utils";

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
    <div className="rounded-xl border border-neutral-300 px-2">
      <Table>
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
                <Badge>{user.isActive ? "Active" : "Disabled"}</Badge>
              </TableCell>

              <TableCell className="space-x-2 text-right">
                <Button
                  onClick={() =>
                    setSelectedUser({
                      username: user.username,
                      role: user.role,
                      id: user.id,
                      isActive: user.isActive,
                    })
                  }
                  size="xs"
                  className="cursor-pointer"
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
                  onClick={() => handleToggleUserStatus({ id: user.id })}
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
          }}
        />
      )}
    </div>
  );
}

export default UsersTable;
