import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/shadcn/table";
import type { IArchivedPatient } from "./ArchivedPatients";
import dayjs from "dayjs";
import { Button } from "@/ui/components/shadcn/button";
import { ArchiveRestore } from "lucide-react";
import { useRestorePatient } from "@/services/apiPatients";

function ArchivedPatientsTable({
  archivedPatients,
}: {
  archivedPatients: IArchivedPatient[];
}) {
  const { mutate: handleRestorePatient } = useRestorePatient();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Sex</TableHead>
          <TableHead>Archived On</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {archivedPatients?.map((patient, i) => (
          <TableRow key={i}>
            <TableCell>{`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

            <TableCell>
              {dayjs().diff(dayjs(patient.dateOfBirth), "year")}
            </TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>{patient.sex.slice(0, 1)}</TableCell>

            <TableCell>
              {dayjs(patient.archivedOn).format("MMMM DD, YYYY")}
            </TableCell>

            <TableCell className="text-right">
              <Button
                onClick={() => {
                  handleRestorePatient(patient.id);
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

export default ArchivedPatientsTable;
