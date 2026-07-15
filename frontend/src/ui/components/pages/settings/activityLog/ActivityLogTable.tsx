import { handleGetActivityLogs } from "@/services/apiActivityLogs";
import type { IActivityLog } from "@/types/ActivityLog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

function ActivityLogTable() {
  const { data: activityLogs } = useQuery<IActivityLog[]>({
    queryKey: ["activityLogs"],
    queryFn: handleGetActivityLogs,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {activityLogs?.map((log) => (
          <TableRow>
            <TableCell>
              {dayjs(log.createdAt).format("MMM D, YYYY h:mm A")}
            </TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.module}</TableCell>
            <TableCell>{log.target}</TableCell>
            <TableCell>{log.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ActivityLogTable;
