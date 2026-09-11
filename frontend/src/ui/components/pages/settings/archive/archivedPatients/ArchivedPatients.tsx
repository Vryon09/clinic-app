import { handleGetArchivedPatients } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";

import { useQuery } from "@tanstack/react-query";
import ArchivedPatientsTable from "./ArchivedPatientsTable";
import { useState } from "react";
import PaginationBar from "@/ui/components/PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";
import { Spinner } from "@/ui/components/shadcn/spinner";

export interface IArchivedPatient extends IPatient {
  archivedOn: Date;
}

function ArchivedPatients() {
  const [page, setPage] = useState<number>(1);

  const { data: archivedPatientsData, isPending: isArchivedPatientsPending } =
    useQuery<PaginatedResponse<IArchivedPatient>>({
      queryFn: () => handleGetArchivedPatients({ page }),
      queryKey: ["archivedPatients", page],
    });

  const archivedPatients = archivedPatientsData?.data;
  const archivedPatientsPagination = archivedPatientsData?.meta;

  if (isArchivedPatientsPending)
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );

  return (
    <div className="space-y-4">
      <ArchivedPatientsTable archivedPatients={archivedPatients!} />

      <PaginationBar
        itemName="Archived Patient"
        isLoading={isArchivedPatientsPending}
        paginationData={archivedPatientsPagination!}
        setPage={setPage}
      />
    </div>
  );
}

export default ArchivedPatients;
