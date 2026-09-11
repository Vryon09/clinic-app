import { useParams } from "react-router";
import { handeGetLabResults } from "@/services/apiLabResults";
import { useQuery } from "@tanstack/react-query";
import type { ILabResult } from "@/types/LabResultType";
import UploadLabResultButton from "./UploadLabResultButton";
import LabResultsTable from "./LabResultsTable";
import { useState } from "react";
import PaginationBar from "../../PaginationBar";
import type { PaginatedResponse } from "@/types/Pagination";
// import { shell } from "electron";

function LabResultSection() {
  const [page, setPage] = useState<number>(1);
  const { patientId } = useParams() as { patientId: string };

  const { data: labResultsData, isPending: isLabResultsPending } = useQuery<
    PaginatedResponse<ILabResult>
  >({
    queryFn: () => handeGetLabResults({ patientId, page }),
    queryKey: ["labResults", patientId, page],
  });

  const labResults = labResultsData?.data;
  const paginationData = labResultsData?.meta;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground">
            Laboratory Results
          </h2>
          <p className="text-xs text-muted-foreground">
            Uploaded lab documents and diagnostic reports for this patient.
          </p>
        </div>
        <UploadLabResultButton />
      </div>

      {/* Table */}
      <LabResultsTable
        labResults={labResults!}
        isLabResultsPending={isLabResultsPending}
      />

      {/* Pagination */}
      <PaginationBar
        itemName="Lab Results"
        paginationData={paginationData!}
        setPage={setPage}
        isLoading={isLabResultsPending}
      />
    </div>
  );
}

export default LabResultSection;
