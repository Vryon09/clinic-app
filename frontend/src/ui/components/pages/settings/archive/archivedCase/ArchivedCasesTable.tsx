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
import { Button } from "@/ui/components/shadcn/button";
import { ArchiveRestore } from "lucide-react";
import type { IArchivedCase } from "./ArchivedCases";
import { useRestoreCase } from "@/services/apiCase";

function ArchivedCasesTable({
  archivedCases,
}: {
  archivedCases: IArchivedCase[];
}) {
  const { mutate: handleRestoreCase } = useRestoreCase();

  return (
    <Table>
      {archivedCases?.length === 0 && (
        <TableCaption>No archived patients found.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Case Name</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Doctor Name</TableHead>
          <TableHead>Archived On</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {archivedCases?.map((caseItem, i) => (
          <TableRow key={i}>
            <TableCell>{caseItem.caseName}</TableCell>

            <TableCell>{`${caseItem.patient.lastName}, ${caseItem.patient.firstName}${caseItem.patient.middleName ? ` ${caseItem.patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

            <TableCell>{caseItem.doctor.username}</TableCell>

            <TableCell>
              {dayjs(caseItem.archivedOn).format("hh:mm A, MMMM DD, YYYY ")}
            </TableCell>

            <TableCell className="text-right">
              <Button
                onClick={() => {
                  handleRestoreCase(caseItem.id);
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

export default ArchivedCasesTable;
