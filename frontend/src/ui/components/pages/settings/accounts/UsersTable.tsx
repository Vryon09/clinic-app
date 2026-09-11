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
// import UserDialog from "./UserDialog";
import { useToggleUserStatus } from "@/services/apiAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function UsersTable({
  users,
}: {
  users: IUser[];
}) {
  const { mutate: handleToggleUserStatus } = useToggleUserStatus();

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <Table>
        {users?.length === 0 && (
          <TableCaption className="my-6 text-sm text-muted-foreground">No users found.</TableCaption>
        )}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Username</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Role</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Status</TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {users?.map((user) => (
            <TableRow key={user.id} className="border-border/60 hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-sm text-foreground py-3">{user.username}</TableCell>

              <TableCell className="py-3">
                <Badge variant="secondary" className="font-semibold text-xs rounded-md">
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="py-3">
                <Badge
                  className={cn(
                    "font-medium text-xs rounded-full px-2.5 py-0.5",
                    user.isActive
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-none"
                      : "bg-muted text-muted-foreground border border-border shadow-none"
                  )}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="py-3 text-right">
                <Button
                  size="sm"
                  variant={user.isActive ? "destructive" : "default"}
                  className={cn(
                    "h-8 rounded-lg px-3 text-xs font-semibold shadow-xs cursor-pointer",
                    !user.isActive && "bg-emerald-600 hover:bg-emerald-500 text-white"
                  )}
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
    </div>
  );
}

export default UsersTable;
