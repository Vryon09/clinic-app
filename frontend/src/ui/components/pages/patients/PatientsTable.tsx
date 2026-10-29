import type { IPatient } from "@/types/PatientType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { useNavigate } from "react-router";
import {
  handleSearchPatients,
  useArchivePatient,
  useUpdatePatient,
} from "@/services/apiPatients";
import dayjs from "dayjs";
import { Button } from "../../shadcn/button";
import {
  MoreHorizontalIcon,
  Pen,
  Phone,
  Trash,
} from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import PaginationBar from "../../PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";
import { Skeleton } from "../../shadcn/skeleton";
import { Card } from "../../shadcn/card";
import EmptyState from "../../common/EmptyState";
import StatusBadge from "../../common/StatusBadge";

function PatientsTable({ searchInput }: { searchInput: string }) {
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>();
  const [page, setPage] = useState<number>(1);

  const { data: patientsData, isPending: isPatientsLoading } = useQuery<
    PaginatedResponse<IPatient>
  >({
    queryFn: () => handleSearchPatients({ search: searchInput, page }),
    queryKey: ["patients", searchInput, page],
  });

  const patients: IPatient[] = patientsData?.data ?? [];
  const paginationData = patientsData?.meta;

  const { mutate: handleArchivePatient } = useArchivePatient();
  const { mutate: handleUpdatePatient } = useUpdatePatient();

  const navigate = useNavigate();

  // Helper to extract initials
  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <>
      <Card className="border-border bg-card overflow-hidden rounded-lg border shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground w-[35%] py-2.5 pl-5 text-[10px] font-semibold tracking-wider uppercase font-mono">
                  Patient & Demographics
                </TableHead>
                <TableHead className="text-muted-foreground w-[30%] py-2.5 text-[10px] font-semibold tracking-wider uppercase font-mono">
                  Contact Information
                </TableHead>
                <TableHead className="text-muted-foreground w-[20%] py-2.5 text-[10px] font-semibold tracking-wider uppercase font-mono">
                  Clinical History
                </TableHead>
                <TableHead className="text-muted-foreground w-[15%] py-2.5 pr-5 text-right text-[10px] font-semibold tracking-wider uppercase font-mono">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPatientsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-border/60">
                    <TableCell className="py-2.5 pl-5">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="bg-muted size-7 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="bg-muted h-3.5 w-32" />
                          <Skeleton className="bg-muted h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="space-y-1">
                        <Skeleton className="bg-muted h-3.5 w-28" />
                        <Skeleton className="bg-muted h-3 w-36" />
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Skeleton className="bg-muted h-5 w-20 rounded-md" />
                    </TableCell>
                    <TableCell className="py-2.5 pr-5 text-right">
                      <Skeleton className="bg-muted ml-auto size-7 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !patients?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8">
                    <EmptyState
                      title={
                        searchInput === ""
                          ? "No patients registered yet"
                          : "No matching patients found"
                      }
                      description={
                        searchInput === ""
                          ? "Click 'Register Patient' above to create your first clinical record."
                          : `No patient records matched "${searchInput}". Try adjusting your search query.`
                      }
                      showMascot={true}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => {
                  const age = dayjs().diff(dayjs(patient.dateOfBirth), "year");
                  const initials = getInitials(
                    patient.firstName,
                    patient.lastName,
                  );
                  const fullName = `${patient.lastName}, ${patient.firstName}${
                    patient.middleName
                      ? ` ${patient.middleName.charAt(0)}.`
                      : ""
                  }`;

                  const encountersCount = patient.records?.length ?? 0;

                  return (
                    <TableRow
                      key={patient.id}
                      className="group border-border hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      {/* Patient & Demographics */}
                      <TableCell className="py-2.5 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/80 text-[10px] font-semibold text-muted-foreground ring-1 ring-border/30">
                            {initials}
                          </div>
                          <div>
                            <p className="text-foreground group-hover:text-primary text-xs font-semibold tracking-tight transition-colors">
                              {fullName}
                            </p>
                            <p className="text-muted-foreground font-mono tabular-nums text-[11px] leading-tight">
                              {patient.sex === "MALE" ? "M" : "F"} · {age}y · DOB{" "}
                              {dayjs(patient.dateOfBirth).format(
                                "YYYY-MM-DD",
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Information */}
                      <TableCell className="py-2.5">
                        <div className="space-y-0.5">
                          <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-medium">
                            <Phone className="text-muted-foreground size-3" />
                            <span>{patient.phone}</span>
                          </div>
                          <p className="text-muted-foreground max-w-xs truncate text-[11px]">
                            {patient.address}
                          </p>
                        </div>
                      </TableCell>

                      {/* Clinical History */}
                      <TableCell className="py-2.5">
                        <StatusBadge
                          variant={encountersCount > 0 ? "info" : "neutral"}
                          className="font-medium text-[11px] py-0.5 px-2 rounded-md"
                        >
                          {encountersCount}{" "}
                          {encountersCount === 1 ? "Encounter" : "Encounters"}
                        </StatusBadge>
                      </TableCell>

                      {/* Actions Menu */}
                      <TableCell className="py-2.5 pr-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground size-7 cursor-pointer rounded-md"
                            >
                              <MoreHorizontalIcon className="size-3.5" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-md"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                              }}
                            >
                              <Pen className="size-3.5" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchivePatient(patient.id);
                              }}
                            >
                              <Trash className="size-3.5" />
                              <span>Delete Record</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {paginationData && (
        <PaginationBar
          itemName="Patient"
          paginationData={paginationData}
          setPage={setPage}
          isLoading={isPatientsLoading}
        />
      )}

      {selectedPatient && (
        <PatientForm
          isOpen={!!selectedPatient}
          setIsOpen={() =>
            setSelectedPatient((prev) => {
              if (!prev) {
                return null;
              }
            })
          }
          action="update"
          handlePatient={(data) =>
            handleUpdatePatient({ ...data, id: selectedPatient.id })
          }
          initialValues={{
            firstName: selectedPatient.firstName,
            lastName: selectedPatient.lastName,
            phone: selectedPatient.phone,
            address: selectedPatient.address,
            sex: selectedPatient.sex,
            dateOfBirth: new Date(selectedPatient.dateOfBirth),
            middleName: selectedPatient.middleName,
          }}
          key={selectedPatient.id}
        />
      )}
    </>
  );
}

export default PatientsTable;
