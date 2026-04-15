import { useNavigate } from "react-router";
import { Button } from "../../shadcn/button";
import { Plus } from "lucide-react";
import type { IRecord } from "@/types/RecordType";
import type { IPatient } from "@/types/PatientType";
import ConsultationRecordsTable from "./ConsultationRecordsTable";
import PaginationBar from "../../PaginationBar";
import type { IPagination } from "@/types/Pagination";

function ConsultationRecords({
  records,
  paginationData,
  patient,
  setPage,
}: {
  records: IRecord[];
  paginationData: IPagination;
  patient: IPatient;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => navigate(`/patients/${patient?.id}/consultations/new`)}
        >
          <Plus /> Add Consultation
        </Button>
      </div>

      <div className="space-y-1">
        <ConsultationRecordsTable records={records} />
      </div>

      <PaginationBar
        itemName="Consultation Records"
        paginationData={paginationData}
        setPage={setPage}
      />
    </div>
  );
}

export default ConsultationRecords;
