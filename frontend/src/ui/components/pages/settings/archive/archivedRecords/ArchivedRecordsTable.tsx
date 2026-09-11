import { useRestoreRecord } from "@/services/apiRecords";
import { Button } from "@/ui/components/shadcn/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/shadcn/table";
import dayjs from "dayjs";
import { ArchiveRestore } from "lucide-react";
import type { IArchivedRecord } from "./ArchivedRecords";

function ArchivedRecordsTable({
  archivedRecords,
}: {
  archivedRecords: IArchivedRecord[];
}) {
  const { mutate: handleRestoreRecord } = useRestoreRecord();

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <Table>
        {archivedRecords?.length === 0 && (
          <TableCaption className="my-6 text-sm text-muted-foreground">No archived consultation records found.</TableCaption>
        )}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Patient Name</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Record Date</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Case</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Archived On</TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {archivedRecords?.map((record, i) => (
            <TableRow key={i} className="border-border/60 hover:bg-muted/30 transition-colors">
              <TableCell className="font-semibold text-sm text-foreground py-3">{`${record.patient.lastName}, ${record.patient.firstName}${record.patient.middleName ? ` ${record.patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

              <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3">
                {dayjs(record.createdAt).format("MMM DD, YYYY")}
              </TableCell>

              <TableCell className="text-xs font-medium text-foreground py-3">{record.case?.caseName}</TableCell>

              <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3">
                {dayjs(record.archivedOn).format("hh:mm A, MMM DD, YYYY")}
              </TableCell>

              <TableCell className="py-3 text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
                  onClick={() => {
                    handleRestoreRecord(record.id);
                  }}
                  title="Restore Record"
                >
                  <ArchiveRestore className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ArchivedRecordsTable;
