import { cn } from "@/lib/utils";
import { useArchiveCase } from "@/services/apiCase";
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
import CaseCardDialog from "./CaseCardDialog";

function CaseCard({ caseItem }: { caseItem: ICase }) {
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdatingCase, setIsUpdatingCase] = useState<boolean>(false);

  const { mutate: handleArchiveRecord } = useArchiveRecord();
  const { mutate: handleArchiveCase } = useArchiveCase();

  const navigate = useNavigate();

  return (
    <>
      <Collapsible
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition-shadow duration-200",
          open && "shadow-sm",
        )}
        key={caseItem.id}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Case header / trigger */}
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center justify-between px-3.5 py-3 text-sm transition-colors duration-150",
              open
                ? "border-b border-border/60 bg-muted/40"
                : "hover:bg-muted/30",
            )}
          >
            {/* Left: folder icon + case name */}
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Folder className="size-3.5" />
              </div>
              <p className="font-semibold capitalize text-foreground">
                {caseItem.caseName}
              </p>
            </div>

            {/* Right: badges + menu + chevron */}
            <div className="flex items-center gap-2">
              {caseItem.records?.length !== 0 && (
                <Badge
                  variant="secondary"
                  className="hidden text-[10px] sm:flex"
                >
                  Latest:{" "}
                  {dayjs(caseItem.records[0].visitDate).format("MMM DD, YYYY")}
                </Badge>
              )}

              <Badge variant="outline" className="text-[10px]">
                {caseItem.records.length}{" "}
                {caseItem.records.length === 1 ? "Record" : "Records"}
              </Badge>

              {caseItem.caseName !== "Default" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="size-7 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUpdatingCase(true);
                      }}
                    >
                      <Pen className="size-3.5" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveCase(caseItem.id);
                      }}
                    >
                      <Trash className="size-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {open ? (
                <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Expanded records list */}
        <CollapsibleContent>
          {caseItem?.records.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No consultation records in this case.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {caseItem.records.map((record) => (
                <div
                  key={record.id}
                  className="flex cursor-pointer items-center justify-between px-3.5 py-3 transition-colors duration-150 hover:bg-muted/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/patients/${record.patientId}/consultations/${record.id}/details`,
                    );
                  }}
                >
                  {/* Visit date */}
                  <div className="w-32 shrink-0">
                    <p className="text-xs font-medium text-foreground">
                      {dayjs(record.visitDate).format("MMM DD, YYYY")}
                    </p>
                  </div>

                  {/* Symptoms & signs summary */}
                  <div className="flex-1 px-4">
                    <p className="truncate text-sm text-foreground">
                      {record.symptoms ? record.symptoms.slice(0, 50) : "—"}
                      {record.symptoms && record.symptoms.length > 50 && "…"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {record.signs ? record.signs.slice(0, 50) : "—"}
                      {record.signs && record.signs.length > 50 && "…"}
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="size-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/patients/${record.patientId}/consultations/${record.id}/edit`,
                            );
                          }}
                        >
                          <Pen className="size-3.5" /> Edit
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
                          <Trash className="size-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {caseItem.caseName !== "Default" && (
        <CaseCardDialog
          caseItem={caseItem}
          isUpdatingCase={isUpdatingCase}
          setIsUpdatingCase={setIsUpdatingCase}
        />
      )}
    </>
  );
}

export default CaseCard;
