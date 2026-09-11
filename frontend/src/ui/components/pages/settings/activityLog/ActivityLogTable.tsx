import { handleGetActivityLogs } from "@/services/apiActivityLogs";
import type { IActivityLog } from "@/types/ActivityLog";
import type { PaginatedResponse } from "@/types/Pagination";
import PaginationBar from "@/ui/components/PaginationBar";
import { Badge } from "@/ui/components/shadcn/badge";
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
    <div className="space-y-4">
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Time</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">User</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Action</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Module</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Target</TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border/60">
            {activityLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                  No activity logs found.
                </TableCell>
              </TableRow>
            )}
            {activityLogs?.map((log) => (
              <TableRow key={log.id} className="border-border/60 hover:bg-muted/30 transition-colors">
                <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap py-3">
                  {dayjs(log.createdAt).format("MMM D, YYYY h:mm A")}
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground py-3">
                  {log.user.username}
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-[11px] font-medium rounded-md bg-muted/30 border-border/80">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="secondary" className="text-[11px] font-medium rounded-md">
                    {log.module}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-foreground py-3 max-w-40 truncate">
                  {log.target}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground py-3 max-w-60 truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        isLoading={isActivityLogsLoading}
        itemName="Log"
        paginationData={activityLogsPaginationData!}
        setPage={setPage}
      />
    </div>
  );
}

export default ActivityLogTable;
