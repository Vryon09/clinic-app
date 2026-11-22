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
import { useState } from "react";
import ConfirmDialog from "@/ui/components/common/ConfirmDialog";

function UsersTable({ users }: { users: IUser[] }) {
  const { mutate: handleToggleUserStatus } = useToggleUserStatus();
  const [userToDisable, setUserToDisable] = useState<IUser | null>(null);

  const toggleStatus = (id: string) => {
    handleToggleUserStatus(
      { id },
      {
        onError: (err) => {
          toast.error("Failed to Update User Status", {
            description:
              err.response?.data?.message ||
              "Could not change staff account access status.",
          });
        },
      },
    );
  };

  return (
    <div className="border-border/80 bg-card overflow-hidden rounded-xl border shadow-2xs">
      <Table>
        {users?.length === 0 && (
          <TableCaption className="text-muted-foreground my-6 text-sm">
            No users found.
          </TableCaption>
        )}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="text-muted-foreground py-3 text-xs font-semibold tracking-wider uppercase">
              Username
            </TableHead>
            <TableHead className="text-muted-foreground py-3 text-xs font-semibold tracking-wider uppercase">
              Role
            </TableHead>
            <TableHead className="text-muted-foreground py-3 text-xs font-semibold tracking-wider uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground py-3 text-right text-xs font-semibold tracking-wider uppercase"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-border/60 divide-y">
          {users?.map((user) => (
            <TableRow
              key={user.id}
              className="border-border/60 hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-foreground py-3 text-sm font-medium">
                {user.username}
              </TableCell>

              <TableCell className="py-3">
                <Badge
                  variant="secondary"
                  className="rounded-md text-xs font-semibold"
                >
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="py-3">
                <Badge
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    user.isActive
                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 shadow-none dark:text-emerald-400"
                      : "bg-muted text-muted-foreground border-border border shadow-none",
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
                    "h-8 cursor-pointer rounded-lg px-3 text-xs font-semibold shadow-xs",
                    !user.isActive &&
                      "bg-emerald-600 text-white hover:bg-emerald-500",
                  )}
                  onClick={() => {
                    if (user.isActive) {
                      setUserToDisable(user);
                    } else {
                      toggleStatus(user.id);
                    }
                  }}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!userToDisable}
        onOpenChange={(open) => !open && setUserToDisable(null)}
        title="Disable User Account?"
        description={`Are you sure you want to deactivate ${userToDisable ? `${userToDisable.firstName} ${userToDisable.lastName} (@${userToDisable.username})` : "this user"}? They will not be able to log in to the clinic application.`}
        confirmLabel="Disable Account"
        onConfirm={() => {
          if (userToDisable) {
            toggleStatus(userToDisable.id);
            setUserToDisable(null);
          }
        }}
      />
    </div>
  );
}

export default UsersTable;
