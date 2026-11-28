import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import {
  ClipboardList,
  MoreHorizontal,
  Pen,
  Plus,
  Printer,
  Square,
  Trash,
} from "lucide-react";
import { Button } from "../../shadcn/button";
import { Badge } from "../../shadcn/badge";
import { Skeleton } from "../../shadcn/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import ConfirmDialog from "../../common/ConfirmDialog";
import EmptyState from "../../common/EmptyState";
import PaginationBar from "../../PaginationBar";
import {
  parseCustomTests,
  parseSelectedTests,
  useDeleteLabRequest,
  usePatientLabRequests,
} from "@/services/apiLabRequests";
import { formatUserName } from "@/lib/utils";
import type { ILabRequest } from "@/types/LabRequestType";
import { NewLabRequestDialog } from "./NewLabRequestDialog";

function summarizeTests(req: ILabRequest): string[] {
  const parsed = parseSelectedTests(req.selectedTests);
  const custom = parseCustomTests(req.customTests);
  const tests: string[] = [];

  Object.values(parsed).forEach((list) => {
    if (Array.isArray(list)) {
      tests.push(...list);
    }
  });

  if (custom.bloodChemistryOthers?.trim()) {
    tests.push(custom.bloodChemistryOthers.trim());
  }
  if (custom.xrayOthers?.trim()) {
    tests.push(custom.xrayOthers.trim());
  }
  if (req.otherExaminations?.trim()) {
    tests.push(req.otherExaminations.trim());
  }

  return tests;
}

export function PatientLabRequestsTab() {
  const { patientId } = useParams() as { patientId: string };
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ILabRequest | null>(
    null,
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: requestsData, isPending: isRequestsPending } =
    usePatientLabRequests(patientId, page);
  const { mutate: deleteLabRequest } = useDeleteLabRequest();

  const labRequests = requestsData?.data || [];
  const paginationData = requestsData?.meta;

  const handleOpenNew = () => {
    setEditingRequest(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (req: ILabRequest) => {
    setEditingRequest(req);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground">
            Laboratory Requests &amp; Referral Slips
          </h2>
          <p className="text-xs text-muted-foreground">
            Create diagnostic lab requests digitally or print blank slips to check
            manually.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/patients/${patientId}/lab-requests/print?mode=manual`)
            }
            className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <Square className="size-3.5" />
            <span>Print Blank Slip</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenNew}
            className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Lab Request</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[140px] py-2.5 text-xs font-semibold">
                Request Date
              </TableHead>
              <TableHead className="py-2.5 text-xs font-semibold">
                Requesting Physician
              </TableHead>
              <TableHead className="py-2.5 text-xs font-semibold">
                Requested Tests
              </TableHead>
              <TableHead className="w-[100px] py-2.5 text-right text-xs font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRequestsPending ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-52" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : labRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={ClipboardList}
                    title="No lab requests yet"
                    description="Create a digital lab request or print a blank referral slip for this patient."
                  />
                </TableCell>
              </TableRow>
            ) : (
              labRequests.map((req) => {
                const tests = summarizeTests(req);
                const visibleTests = tests.slice(0, 4);
                const remaining = tests.length - visibleTests.length;

                return (
                  <TableRow
                    key={req.id}
                    className="group cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      navigate(
                        `/patients/${patientId}/lab-requests/print?requestId=${req.id}&mode=digital`,
                      )
                    }
                  >
                    <TableCell className="py-3 text-xs font-medium whitespace-nowrap">
                      {dayjs(req.requestDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      {req.doctor
                        ? formatUserName(req.doctor, {
                            includeMiddle: true,
                            useMiddleInitial: true,
                          })
                        : "Unassigned"}
                    </TableCell>
                    <TableCell className="py-3">
                      {tests.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">
                          Blank / No tests checked
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1">
                          {visibleTests.map((t, i) => (
                            <Badge
                              key={`${t}-${i}`}
                              variant="secondary"
                              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                            >
                              {t}
                            </Badge>
                          ))}
                          {remaining > 0 && (
                            <Badge
                              variant="outline"
                              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                            >
                              +{remaining} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      className="py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 cursor-pointer"
                          title="Print Lab Request"
                          onClick={() =>
                            navigate(
                              `/patients/${patientId}/lab-requests/print?requestId=${req.id}&mode=digital`,
                            )
                          }
                        >
                          <Printer className="size-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 cursor-pointer"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs"
                              onClick={() =>
                                navigate(
                                  `/patients/${patientId}/lab-requests/print?requestId=${req.id}&mode=digital`,
                                )
                              }
                            >
                              <Printer className="size-3.5" />
                              View / Print Slip
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs"
                              onClick={() => handleOpenEdit(req)}
                            >
                              <Pen className="size-3.5" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive"
                              onClick={() => setDeleteTargetId(req.id)}
                            >
                              <Trash className="size-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {paginationData && (
        <PaginationBar
          itemName="Lab Requests"
          paginationData={paginationData}
          setPage={setPage}
          isLoading={isRequestsPending}
        />
      )}

      <NewLabRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patientId={patientId}
        editingRequest={editingRequest}
      />

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        title="Delete Lab Request?"
        description="Are you sure you want to delete this lab request from the patient's record? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteLabRequest(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
      />
    </div>
  );
}
