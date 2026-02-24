import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";

function PatientsTable() {
  return (
    <Table>
      <TableCaption>A list of your patients.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Birthday</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>31</TableCell>
          <TableCell>January 1, 1967</TableCell>
          <TableCell>United Estados</TableCell>
          <TableCell>09676767676</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default PatientsTable;
