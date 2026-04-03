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
import { useNavigate } from "react-router";
import {
  handleSearchPatients,
  useDeletePatient,
  useUpdatePatient,
} from "@/services/apiPatients";
import dayjs from "dayjs";
import { Button } from "../../shadcn/button";
import { MoreHorizontalIcon, Pen, Trash } from "lucide-react";
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

function PatientsTable({ searchInput }: { searchInput: string }) {
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>();

  const { data: patients, isPending: isPatientsLoading } = useQuery<IPatient[]>(
    {
      queryFn: () => handleSearchPatients({ search: searchInput }),
      queryKey: ["patients", searchInput],
    },
  );

  const { mutate: handleDeletePatient } = useDeletePatient();
  const { mutate: handleUpdatePatient } = useUpdatePatient();

  const navigate = useNavigate();

  if (isPatientsLoading) return <p>Loading...</p>;

  return (
    <>
      <div>
        <Table>
          <TableCaption>
            {patients?.length
              ? "A list of your patients."
              : searchInput === ""
                ? "Add your first patient by clicking the Add Patient Button."
                : "No patients found."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients?.map((patient) => (
              <TableRow
                key={patient.id}
                className="cursor-pointer hover:bg-neutral-200"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <TableCell>{`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}</TableCell>
                <TableCell>
                  {dayjs().diff(dayjs(patient.dateOfBirth), "year")}
                </TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.sex.slice(0, 1)}</TableCell>

                <TableCell className="space-x-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer"
                      >
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-neutral-200!"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
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
                          handleDeletePatient(patient.id);
                        }}
                      >
                        <Trash /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
            middleName: selectedPatient?.middleName || "",
          }}
          key={selectedPatient.id}
        />
      )}
    </>
  );
}

export default PatientsTable;
