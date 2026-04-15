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

  console.log(labResults);

  if (isLabResultsPending) return <p>Loading...</p>;

  return (
    <div>
      <UploadLabResultButton />

      {!isLabResultsPending && <LabResultsTable labResults={labResults!} />}

      <PaginationBar
        itemName="Lab Results"
        paginationData={paginationData!}
        setPage={setPage}
      />
    </div>
  );
}

export default LabResultSection;
