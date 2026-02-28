import type { IPatient } from "@/types/PatientType";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { handleGetPatients } from "@/services/apiPatients";
import dayjs from "dayjs";

function PatientsTable() {
  const { data: patients, isPending: isPatientsLoading } = useQuery<IPatient[]>(
    {
      queryFn: handleGetPatients,
      queryKey: ["patients"],
    },
  );

  const navigate = useNavigate();

  if (isPatientsLoading) return <p>Loading...</p>;

  console.log(patients);

  return (
    <Table>
      <TableCaption>
        {patients?.length
          ? "A list of your patients."
          : "Add your first patient by clicking the Add Patient Button."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Sex</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients?.map((patient) => (
          <TableRow
            key={patient.id}
            className="cursor-pointer hover:bg-neutral-200"
            onClick={() => navigate(`/patients/${patient.id}`)}
          >
            <TableCell>{`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>
            <TableCell>
              {dayjs().diff(dayjs(patient.dateOfBirth), "year")}
            </TableCell>
            <TableCell>{patient.sex.slice(0, 1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PatientsTable;
