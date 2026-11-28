import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import {
  FileCheck2,
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
  useDeleteMedicalCertificate,
  usePatientMedicalCertificates,
} from "@/services/apiMedicalCertificates";
import { formatUserName } from "@/lib/utils";
import type { IMedicalCertificate } from "@/types/MedicalCertificateType";
import { getTemplateLabel } from "./medicalCertificateCatalog";
import { NewMedicalCertificateDialog } from "./NewMedicalCertificateDialog";

export function PatientMedicalCertificatesTab() {
  const { patientId } = useParams() as { patientId: string };
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<IMedicalCertificate | null>(
    null,
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: certsData, isPending: isCertsPending } =
    usePatientMedicalCertificates(patientId, page);
  const { mutate: deleteCertificate } = useDeleteMedicalCertificate();

  const certificates = certsData?.data || [];
  const paginationData = certsData?.meta;

  const handleOpenNew = () => {
    setEditingCert(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cert: IMedicalCertificate) => {
    setEditingCert(cert);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground">
            Medical Certificates
          </h2>
          <p className="text-xs text-muted-foreground">
            Issue digital medical certificates (Clearance, Diagnosis, or
            Pre-Employment PE) or print blank templates.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                `/patients/${patientId}/medical-certificates/print?mode=manual`,
              )
            }
            className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <Square className="size-3.5" />
            <span>Print Blank Certificate</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenNew}
            className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Medical Certificate</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[130px] py-2.5 text-xs font-semibold">
                Date Issued
              </TableHead>
              <TableHead className="w-[170px] py-2.5 text-xs font-semibold">
                Template
              </TableHead>
              <TableHead className="py-2.5 text-xs font-semibold">
                Physician
              </TableHead>
              <TableHead className="py-2.5 text-xs font-semibold">
                Details / Purpose
              </TableHead>
              <TableHead className="w-[100px] py-2.5 text-right text-xs font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isCertsPending ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={FileCheck2}
                    title="No medical certificates yet"
                    description="Create a digital medical certificate or print a blank template for this patient."
                  />
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => {
                const summary =
                  cert.diagnosis ||
                  cert.reasonForVisit ||
                  cert.purpose ||
                  cert.remarks ||
                  "—";

                return (
                  <TableRow
                    key={cert.id}
                    className="group cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      navigate(
                        `/patients/${patientId}/medical-certificates/print?certificateId=${cert.id}&mode=digital`,
                      )
                    }
                  >
                    <TableCell className="py-3 text-xs font-medium whitespace-nowrap">
                      {dayjs(cert.certificateDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                      >
                        {getTemplateLabel(cert.templateType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      {cert.doctor
                        ? formatUserName(cert.doctor, {
                            includeMiddle: true,
                            useMiddleInitial: true,
                          })
                        : "Unassigned"}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate py-3 text-xs text-muted-foreground">
                      {summary}
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
                          title="Print Medical Certificate"
                          onClick={() =>
                            navigate(
                              `/patients/${patientId}/medical-certificates/print?certificateId=${cert.id}&mode=digital`,
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
                                  `/patients/${patientId}/medical-certificates/print?certificateId=${cert.id}&mode=digital`,
                                )
                              }
                            >
                              <Printer className="size-3.5" />
                              View / Print Certificate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs"
                              onClick={() => handleOpenEdit(cert)}
                            >
                              <Pen className="size-3.5" />
                              Edit Certificate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive"
                              onClick={() => setDeleteTargetId(cert.id)}
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
          itemName="Medical Certificates"
          paginationData={paginationData}
          setPage={setPage}
          isLoading={isCertsPending}
        />
      )}

      <NewMedicalCertificateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patientId={patientId}
        editingCertificate={editingCert}
      />

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        title="Delete Medical Certificate"
        description="Are you sure you want to delete this medical certificate? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteCertificate(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
      />
    </div>
  );
}
