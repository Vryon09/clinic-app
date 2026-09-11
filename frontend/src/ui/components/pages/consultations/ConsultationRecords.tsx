import { useNavigate } from "react-router";
import { Button } from "../../shadcn/button";
import { Stethoscope } from "lucide-react";
import type { IPatient } from "@/types/PatientType";
import ConsultationRecordsTable from "./recordsTable/ConsultationRecordsTable";

function ConsultationRecords({ patient }: { patient: IPatient }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground">
            Encounters &amp; Medical Cases
          </h2>
          <p className="text-xs text-muted-foreground">
            Historical consultations, case notes, and prescriptions for this
            patient.
          </p>
        </div>

        <Button
          size="sm"
          className="h-9 shrink-0 gap-1.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
          onClick={() => navigate(`/patients/${patient?.id}/consultations/new`)}
        >
          <Stethoscope className="size-3.5" />
          <span>New Consultation</span>
        </Button>
      </div>

      <ConsultationRecordsTable />
    </div>
  );
}

export default ConsultationRecords;
