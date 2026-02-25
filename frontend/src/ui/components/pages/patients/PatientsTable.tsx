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

function PatientsTable({ patients }: { patients?: IPatient[] }) {
  console.log(patients);

  return (
    <Table>
      <TableCaption>A list of your patients.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients?.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.id}</TableCell>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PatientsTable;
