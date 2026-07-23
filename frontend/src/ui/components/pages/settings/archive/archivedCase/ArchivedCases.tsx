import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PaginationBar from "@/ui/components/PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";
import type { ICase } from "@/types/CaseType";
import { handleGetArchivedCases } from "@/services/apiCase";
import ArchivedCasesTable from "./ArchivedCasesTable";
import type { IPatient } from "@/types/PatientType";
import { Spinner } from "../../../../shadcn/spinner";

export interface IArchivedCase extends ICase {
  archivedOn: Date;
  patient: IPatient;
}

function ArchivedCases() {
  const [page, setPage] = useState<number>(1);

  const { data: archivedCasesData, isPending: isArchivedCasesPending } =
    useQuery<PaginatedResponse<IArchivedCase>>({
      queryFn: () => handleGetArchivedCases({ page }),
      queryKey: ["archivedCases", page],
    });

  const archivedCases = archivedCasesData?.data;
  const archivedCasesPagination = archivedCasesData?.meta;

  if (isArchivedCasesPending)
    return (
      <div className="flex justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return (
    <div>
      <ArchivedCasesTable archivedCases={archivedCases!} />

      <PaginationBar
        itemName="Archived Patients"
        isLoading={isArchivedCasesPending}
        paginationData={archivedCasesPagination!}
        setPage={setPage}
      />
    </div>
  );
}

export default ArchivedCases;
