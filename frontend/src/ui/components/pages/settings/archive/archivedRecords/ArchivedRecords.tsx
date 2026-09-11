import { handleGetArchivedRecords } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import ArchivedRecordsTable from "./ArchivedRecordsTable";
import { useState } from "react";
import PaginationBar from "@/ui/components/PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";
import type { ICase } from "@/types/CaseType";
import { Spinner } from "@/ui/components/shadcn/spinner";

export interface IArchivedRecord extends IRecord {
  patient: { firstName: string; middleName: string; lastName: string };
  archivedOn: Date;
  case: ICase;
}

function ArchivedRecords() {
  const [page, setPage] = useState<number>(1);
  const { data: archivedRecordsData, isPending: isArchivedRecordsPending } =
    useQuery<PaginatedResponse<IArchivedRecord>>({
      queryFn: () => handleGetArchivedRecords({ page }),
      queryKey: ["archivedRecords", page],
    });

  const archivedRecords = archivedRecordsData?.data;
  const archivedRecordsPagination = archivedRecordsData?.meta;

  if (isArchivedRecordsPending)
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );

  return (
    <div className="space-y-4">
      <ArchivedRecordsTable archivedRecords={archivedRecords!} />

      <PaginationBar
        itemName="Archived Record"
        isLoading={isArchivedRecordsPending}
        paginationData={archivedRecordsPagination!}
        setPage={setPage}
      />
    </div>
  );
}

export default ArchivedRecords;
