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
    <Table>
      {archivedRecords?.length === 0 && (
        <TableCaption>No archived records found.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
          <TableHead>Record Date</TableHead>
          <TableHead>Case</TableHead>
          <TableHead>Archived On</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {archivedRecords?.map((record, i) => (
          <TableRow key={i}>
            <TableCell>{`${record.patient.lastName}, ${record.patient.firstName}${record.patient.middleName ? ` ${record.patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

            <TableCell>
              {dayjs(record.createdAt).format("MMMM DD, YYYY")}
            </TableCell>

            <TableCell>{record.case.caseName}</TableCell>

            <TableCell>
              {dayjs(record.archivedOn).format("MMMM DD, YYYY")}
            </TableCell>

            <TableCell className="text-right">
              <Button
                onClick={() => {
                  handleRestoreRecord(record.id);
                }}
                size="icon-sm"
              >
                <ArchiveRestore />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ArchivedRecordsTable;
