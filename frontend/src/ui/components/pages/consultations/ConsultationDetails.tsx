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
import { Button } from "../../shadcn/button";
import BackButton from "../../BackButton";

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
    <div>
      <div className="flex items-center justify-between print:hidden">
        <BackButton location={`/patients/${patientId}`} />

        <div className="space-x-2">
          <Button
            className="cursor-pointer"
            size="xs"
            variant={isPrintMode ? "outline" : "default"}
            onClick={() => setIsPrintMode(false)}
          >
            User Mode
          </Button>

          <Button
            className="cursor-pointer"
            size="xs"
            variant={!isPrintMode ? "outline" : "default"}
            onClick={() => setIsPrintMode(true)}
          >
            PrintMode
          </Button>
        </div>
      </div>

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
