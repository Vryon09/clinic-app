import {
  handleGetArchivedPatients,
  useRestorePatient,
} from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
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

interface IArchivedPatient extends IPatient {
  archivedOn: Date;
}

function ArchivedPatients() {
  const { data: archivedPatients, isPending: isArchivedPatientsPending } =
    useQuery<IArchivedPatient[]>({
      queryFn: handleGetArchivedPatients,
      queryKey: ["archivedPatients"],
    });

  const { mutate: handleRestorePatient } = useRestorePatient();

  if (isArchivedPatientsPending) return <p>loading...</p>;

  return (
    <div>
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
    </div>
  );
}

export default ArchivedPatients;
