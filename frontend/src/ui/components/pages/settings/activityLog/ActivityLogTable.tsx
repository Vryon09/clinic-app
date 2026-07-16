import { handleGetActivityLogs } from "@/services/apiActivityLogs";
import type { IActivityLog } from "@/types/ActivityLog";
import type { PaginatedResponse } from "@/types/Pagination";
import PaginationBar from "@/ui/components/PaginationBar";
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
import { useState } from "react";

function ActivityLogTable() {
  const [page, setPage] = useState<number>(1);

  const { data: activityLogsData, isPending: isActivityLogsLoading } = useQuery<
    PaginatedResponse<IActivityLog>
  >({
    queryKey: ["activityLogs", page],
    queryFn: () => handleGetActivityLogs({ page }),
  });

  const activityLogs = activityLogsData?.data || [];
  const activityLogsPaginationData = activityLogsData?.meta;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {activityLogs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {dayjs(log.createdAt).format("MMM D, YYYY h:mm A")}
              </TableCell>
              <TableCell>{log.user.username}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.module}</TableCell>
              <TableCell>{log.target}</TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationBar
        isLoading={isActivityLogsLoading}
        itemName="Log"
        paginationData={activityLogsPaginationData!}
        setPage={setPage}
      />
    </>
  );
}

export default ActivityLogTable;
