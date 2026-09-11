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
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <Table>
        {archivedCases?.length === 0 && (
          <TableCaption className="my-6 text-sm text-muted-foreground">No archived cases found.</TableCaption>
        )}
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Case Name</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Patient Name</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Doctor</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">Archived On</TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {archivedCases?.map((caseItem, i) => (
            <TableRow key={i} className="border-border/60 hover:bg-muted/30 transition-colors">
              <TableCell className="font-semibold text-sm text-foreground py-3">{caseItem.caseName}</TableCell>

              <TableCell className="text-xs font-medium text-foreground py-3">{`${caseItem.patient.lastName}, ${caseItem.patient.firstName}${caseItem.patient.middleName ? ` ${caseItem.patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>

              <TableCell className="text-xs text-muted-foreground py-3">{caseItem.doctor.username}</TableCell>

              <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3">
                {dayjs(caseItem.archivedOn).format("hh:mm A, MMM DD, YYYY")}
              </TableCell>

              <TableCell className="py-3 text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
                  onClick={() => {
                    handleRestoreCase(caseItem.id);
                  }}
                  title="Restore Case"
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

export default ArchivedCasesTable;
