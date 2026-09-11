import { handleGetRecord } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { IVitalSigns } from "@/types/VitalSignsType";
import { handleGetVitalSigns } from "@/services/apiVitalSigns";
import type { IRecordMedications } from "@/types/RecordMedicationsType";
import { handleGetRecordMedications } from "@/services/apiRecordMedications";
import { useState } from "react";
import ConsultationUserView from "./ConsultationUserView";
import ConsultationPrintView from "./ConsultationPrintView";
import BackButton from "../../../BackButton";
import { Eye, Printer } from "lucide-react";

function ConsultationDetails() {
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  const { consultationId, patientId } = useParams() as {
    consultationId: string;
    patientId: string;
  };

  const { data: record } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { data: vitalSigns } = useQuery<IVitalSigns>({
    queryFn: () => handleGetVitalSigns(consultationId),
    queryKey: ["vitalSigns", consultationId],
  });

  const { data: recordMedications } = useQuery<IRecordMedications[]>({
    queryFn: () => handleGetRecordMedications(consultationId),
    queryKey: ["recordMedications", consultationId],
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between print:hidden">
        <BackButton location={`/patients/${patientId}`} />

        {/* View mode switcher */}
        <div className="flex items-center overflow-hidden rounded-lg border border-border/80 bg-muted/30 p-0.5">
          <button
            type="button"
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              !isPrintMode
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setIsPrintMode(false)}
          >
            <Eye className="size-3.5" />
            User View
          </button>
          <button
            type="button"
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              isPrintMode
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setIsPrintMode(true)}
          >
            <Printer className="size-3.5" />
            Print View
          </button>
        </div>
      </div>

      {/* Content */}
      {isPrintMode ? (
        <ConsultationPrintView
          record={record!}
          vitalSigns={vitalSigns!}
          recordMedications={recordMedications!}
        />
      ) : (
        <ConsultationUserView
          record={record!}
          vitalSigns={vitalSigns!}
          recordMedications={recordMedications!}
        />
      )}
    </div>
  );
}

export default ConsultationDetails;
