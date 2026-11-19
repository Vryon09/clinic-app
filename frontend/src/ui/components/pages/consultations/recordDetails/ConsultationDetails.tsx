import { handleGetRecord } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, useSearchParams } from "react-router";
import type { IVitalSigns } from "@/types/VitalSignsType";
import { handleGetVitalSigns } from "@/services/apiVitalSigns";
import type { IRecordMedications } from "@/types/RecordMedicationsType";
import { handleGetRecordMedications } from "@/services/apiRecordMedications";
import { useEffect } from "react";
import { handleGetPatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { savePatientReturnContext } from "@/lib/patientNavigation";
import ConsultationUserView from "./ConsultationUserView";
import ConsultationPrintView from "./ConsultationPrintView";
import BackButton from "../../../BackButton";
import { Eye, Printer } from "lucide-react";

function ConsultationDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isPrintMode = searchParams.get("view") === "print";

  const { consultationId, patientId } = useParams() as {
    consultationId: string;
    patientId: string;
  };

  const { data: record } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { data: patient } = useQuery<IPatient>({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: vitalSigns } = useQuery<IVitalSigns>({
    queryFn: () => handleGetVitalSigns(consultationId),
    queryKey: ["vitalSigns", consultationId],
  });

  const { data: recordMedications } = useQuery<IRecordMedications[]>({
    queryFn: () => handleGetRecordMedications(consultationId),
    queryKey: ["recordMedications", consultationId],
  });

  useEffect(() => {
    if (patientId) {
      const patientName = patient
        ? `${patient.firstName} ${patient.lastName}`.trim()
        : undefined;

      savePatientReturnContext({
        returnUrl: `${location.pathname}${location.search}`,
        patientName,
        contextLabel: isPrintMode ? "Print Report" : "Consultation Details",
      });
    }
  }, [patientId, location.pathname, location.search, isPrintMode, patient]);

  const handleSetPrintMode = (print: boolean) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (print) {
          next.set("view", "print");
        } else {
          next.delete("view");
        }
        return next;
      },
      { replace: true }
    );
  };

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
            onClick={() => handleSetPrintMode(false)}
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
            onClick={() => handleSetPrintMode(true)}
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
