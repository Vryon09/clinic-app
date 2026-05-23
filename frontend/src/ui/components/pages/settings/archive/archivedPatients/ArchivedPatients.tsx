import { handleGetArchivedPatients } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";

import { useQuery } from "@tanstack/react-query";
import ArchivedPatientsTable from "./ArchivedPatientsTable";
import { useState } from "react";
import PaginationBar from "@/ui/components/PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";

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

  if (isArchivedPatientsPending) return <p>loading...</p>;

  return (
    <div>
      <ArchivedPatientsTable archivedPatients={archivedPatients!} />

      <PaginationBar
        itemName="Archived Patients"
        isLoading={isArchivedPatientsPending}
        paginationData={archivedPatientsPagination!}
        setPage={setPage}
      />
    </div>
  );
}

export default ArchivedPatients;
