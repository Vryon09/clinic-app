import {
  Table,
  TableBody,
  TableCaption,
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
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <Table>
        {archivedPatients?.length === 0 && (
          <TableCaption className="my-6 text-sm text-muted-foreground">No archived patients found.</TableCaption>
        )}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Patient Name</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Age</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Phone</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Sex</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Archived On</TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {archivedPatients?.map((patient, i) => (
            <TableRow key={i} className="border-border/60 hover:bg-muted/30 transition-colors">
              <TableCell className="font-semibold text-sm text-foreground py-3">{`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

              <TableCell className="text-xs font-medium text-foreground py-3">
                {dayjs().diff(dayjs(patient.dateOfBirth), "year")}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground py-3">{patient.phone}</TableCell>
              <TableCell className="text-xs text-muted-foreground py-3">{patient.sex.slice(0, 1)}</TableCell>

              <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3">
                {dayjs(patient.archivedOn).format("hh:mm A, MMM DD, YYYY")}
              </TableCell>

              <TableCell className="py-3 text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
                  onClick={() => {
                    handleRestorePatient(patient.id);
                  }}
                  title="Restore Patient"
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

export default ArchivedPatientsTable;
