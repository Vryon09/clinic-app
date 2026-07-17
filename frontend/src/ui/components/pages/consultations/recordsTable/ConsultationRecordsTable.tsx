import { handleGetCases } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import CaseCard from "./CaseCard";
import { Spinner } from "@/ui/components/shadcn/spinner";

function ConsultationRecordsTable() {
  const { patientId } = useParams() as {
    patientId: string;
  };

  const { data: cases, isPending: isCasesLoading } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
  });

  if (isCasesLoading)
    return (
      <div className="flex justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return (
    <div className="space-y-2">
      {cases?.map((caseItem) => (
        <CaseCard key={caseItem.id} caseItem={caseItem} />
      ))}
    </div>
  );
}

export default ConsultationRecordsTable;
