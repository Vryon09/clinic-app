import { handleGetCases } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import CaseCard from "./CaseCard";
import { Skeleton } from "@/ui/components/shadcn/skeleton";
import EmptyState from "@/ui/components/common/EmptyState";

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
      <div className="space-y-2.5 py-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-14 w-full rounded-xl bg-muted/60"
          />
        ))}
      </div>
    );

  if (!cases?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-6 text-center">
        <EmptyState
          title="No Consultation Records"
          description="No medical cases or consultation records found for this patient. Click 'New Consultation' above to begin."
          showMascot={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {cases.map((caseItem) => (
        <CaseCard key={caseItem.id} caseItem={caseItem} />
      ))}
    </div>
  );
}

export default ConsultationRecordsTable;
