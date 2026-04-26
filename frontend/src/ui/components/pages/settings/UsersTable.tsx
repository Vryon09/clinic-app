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

function UsersTable({ users }: { users: IUser[] }) {
  return (
    <div className="rounded-xl border border-neutral-300 px-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>

              <TableCell>
                <Badge>{user.role}</Badge>
              </TableCell>

              <TableCell className="space-x-2">
                <Button size="xs">Delete</Button>
                <Button size="xs">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UsersTable;
