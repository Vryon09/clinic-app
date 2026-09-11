import { handleGetCases } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import CaseCard from "./CaseCard";
import { Skeleton } from "@/ui/components/shadcn/skeleton";
import { FolderKanban } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-12 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FolderKanban className="size-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          No Consultation Records
        </h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          No medical cases or consultation records found for this patient. Click
          &ldquo;New Consultation&rdquo; above to begin.
        </p>
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
