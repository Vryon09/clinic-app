import { cn } from "@/lib/utils";
import { useArchiveRecord } from "@/services/apiRecords";
import type { ICase } from "@/types/CaseType";
import { Badge } from "@/ui/components/shadcn/badge";
import { Button } from "@/ui/components/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/components/shadcn/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/shadcn/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/ui/components/shadcn/table";
import dayjs from "dayjs";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Folder,
  MoreHorizontal,
  Pen,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

function CaseCard({ caseItem }: { caseItem: ICase }) {
  const [open, setOpen] = useState<boolean>(false);

  const { mutate: handleArchiveRecord } = useArchiveRecord();

  const navigate = useNavigate();

  return (
    <Collapsible
      className="flex flex-col rounded-lg border"
      key={caseItem.id}
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger asChild>
        <div
          className={cn(
            "hover:bg-muted/50 flex cursor-pointer items-center justify-between px-2 py-2 text-sm",
            open && "border-b",
          )}
        >
          <div className="flex items-center gap-2">
            <Folder className="size-4" />
            <p className="capitalize">{caseItem.caseName}</p>
          </div>

          <div className="flex items-center gap-2">
            {caseItem.records?.length !== 0 && (
              <Badge className="dark:bg-primary bg-blue-500 dark:text-blue-500">
                Latest:{" "}
                {dayjs(caseItem.records[0].visitDate).format("MMMM DD, YYYY")}
              </Badge>
            )}
            <Badge>{caseItem.records.length} Records</Badge>
            {open ? (
              <ChevronUp className="size-5" />
            ) : (
              <ChevronDown className="size-5" />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">
        <Table>
          {caseItem?.records.length === 0 && (
            <TableCaption className="pb-4">No records found</TableCaption>
          )}
          <TableBody>
            {caseItem.records.map((record) => (
              <TableRow
                key={record.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/patients/${record.patientId}/consultations/${record.id}/details`,
                  );
                }}
              >
                <TableCell className="w-30">
                  {dayjs(record.visitDate).format("MMMM DD, YYYY")}
                </TableCell>

                <TableCell>
                  <p>
                    {record.symptoms ? record.symptoms.slice(0, 20) : "N/A"}
                    {record.symptoms
                      ? record.symptoms?.length > 20 && "..."
                      : ""}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {record.signs ? record.signs.slice(0, 20) : "N/A"}
                    {record.signs ? record.signs?.length > 20 && "..." : ""}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/patients/${record.patientId}/consultations/${record.id}/edit`,
                            );
                          }}
                        >
                          <Pen /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveRecord(record.id);
                          }}
                        >
                          <Trash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="size-4" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CaseCard;
