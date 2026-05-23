import {
  handleGetArchivedRecords,
  useRestoreRecord,
} from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { Button } from "@/ui/components/shadcn/button";
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
import { ArchiveRestore } from "lucide-react";

interface IArchivedRecord extends IRecord {
  patient: { firstName: string; middleName: string; lastName: string };
  archivedOn: Date;
}

function ArchivedRecords() {
  const { data: archivedRecords, isPending: isArchivedRecordsPending } =
    useQuery<IArchivedRecord[]>({
      queryFn: handleGetArchivedRecords,
      queryKey: ["archivedRecords"],
    });

  const { mutate: handleRestoreRecord } = useRestoreRecord();

  if (isArchivedRecordsPending) return <p>loading...</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Record Date</TableHead>
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
    </div>
  );
}

export default ArchivedRecords;
