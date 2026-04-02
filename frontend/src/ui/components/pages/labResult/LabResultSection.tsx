import { useParams } from "react-router";
import { handeGetLabResults } from "@/services/apiLabResults";
import { useQuery } from "@tanstack/react-query";
import type { ILabResult } from "@/types/LabResultType";
import UploadLabResultButton from "./UploadLabResultButton";
import LabResultsTable from "./LabResultsTable";
// import { shell } from "electron";

function LabResultSection() {
  const { patientId } = useParams() as { patientId: string };

  const { data: labResults, isPending: isLabResultsPending } = useQuery<
    ILabResult[]
  >({
    queryFn: () => handeGetLabResults({ patientId }),
    queryKey: ["labResults", patientId],
  });

  return (
    <div>
      <UploadLabResultButton />

      {!isLabResultsPending && <LabResultsTable labResults={labResults!} />}
    </div>
  );
}

export default LabResultSection;
