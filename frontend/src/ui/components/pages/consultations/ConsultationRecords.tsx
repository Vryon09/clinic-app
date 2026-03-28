import { useNavigate } from "react-router";
import { Button } from "../../shadcn/button";
import { Plus } from "lucide-react";
import type { IRecord } from "@/types/RecordType";
import RecordCard from "./RecordCard";
import type { IPatient } from "@/types/PatientType";

function ConsultationRecords({
  records,
  patient,
}: {
  records: IRecord[];
  patient: IPatient;
}) {
  const navigate = useNavigate();

  return (
    <div className="col-span-2">
      <div className="mb-4 flex items-center justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => navigate(`/patients/${patient?.id}/consultations/new`)}
        >
          <Plus /> Add Consultation
        </Button>
      </div>

      <div className="space-y-1">
        {records?.map((record) => (
          <RecordCard record={record} />
        ))}
      </div>
    </div>
  );
}

export default ConsultationRecords;
