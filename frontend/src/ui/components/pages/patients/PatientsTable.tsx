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
  FileText,
  MoreHorizontalIcon,
  Pen,
  Phone,
  Trash,
  Users,
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
      <Card className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-[35%] py-3.5 pl-6 text-[11px] font-semibold tracking-wider uppercase">
                  Patient & Demographics
                </TableHead>
                <TableHead className="text-muted-foreground w-[30%] py-3.5 text-[11px] font-semibold tracking-wider uppercase">
                  Contact Information
                </TableHead>
                <TableHead className="text-muted-foreground w-[20%] py-3.5 text-[11px] font-semibold tracking-wider uppercase">
                  Clinical History
                </TableHead>
                <TableHead className="text-muted-foreground w-[15%] py-3.5 pr-6 text-right text-[11px] font-semibold tracking-wider uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPatientsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-border/40">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="bg-muted size-9 rounded-lg" />
                        <div className="space-y-1.5">
                          <Skeleton className="bg-muted h-4 w-32" />
                          <Skeleton className="bg-muted h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1.5">
                        <Skeleton className="bg-muted h-4 w-28" />
                        <Skeleton className="bg-muted h-3 w-36" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="bg-muted h-5 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Skeleton className="bg-muted ml-auto size-8 rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !patients?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-14 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center gap-2">
                      <div className="bg-muted/60 text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
                        <Users className="size-6" />
                      </div>
                      <p className="text-foreground mt-1 text-sm font-semibold">
                        {searchInput === ""
                          ? "No patients registered yet"
                          : "No matching patients found"}
                      </p>
                      <p className="text-muted-foreground max-w-xs text-xs">
                        {searchInput === ""
                          ? "Click 'Register Patient' to create your first clinical record."
                          : `No patient records matched "${searchInput}". Try adjusting your search query.`}
                      </p>
                    </div>
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

                  console.log(patient)

                  return (
                    <TableRow
                      key={patient.id}
                      className="group border-border/50 hover:bg-muted/40 cursor-pointer transition-colors"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      {/* Patient & Demographics */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors">
                            {initials}
                          </div>
                          <div>
                            <p className="text-foreground group-hover:text-primary text-sm font-semibold tracking-tight transition-colors">
                              {fullName}
                            </p>
                            <p className="text-muted-foreground text-[11px]">
                              {patient.sex === "MALE" ? "Male" : "Female"} ·{" "}
                              {age} yrs · DOB{" "}
                              {dayjs(patient.dateOfBirth).format(
                                "MMM DD, YYYY",
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Information */}
                      <TableCell className="py-3.5">
                        <div className="space-y-0.5">
                          <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                            <Phone className="text-muted-foreground size-3" />
                            <span>{patient.phone}</span>
                          </div>
                          <p className="text-muted-foreground max-w-xs truncate text-[11px]">
                            {patient.address}
                          </p>
                        </div>
                      </TableCell>

                      {/* Clinical History */}
                      <TableCell className="py-3.5">
                        <span className="bg-secondary/80 text-secondary-foreground inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium">
                          <FileText className="text-muted-foreground size-3" />
                          <span>{patient.records?.length ?? 0} Encounters</span>
                        </span>
                      </TableCell>

                      {/* Actions Menu */}
                      <TableCell className="py-3.5 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              onClick={(e) => e.stopPropagation()}
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                            >
                              <MoreHorizontalIcon className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl"
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
