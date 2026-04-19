import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { Plus } from "lucide-react";
import type { IRecord } from "@/types/RecordType";
import type { IPatient } from "@/types/PatientType";
import ConsultationRecordsTable from "./ConsultationRecordsTable";
import PaginationBar from "../../PaginationBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/types/Pagination";
import { handleGetRecords } from "@/services/apiRecords";

function ConsultationRecords({ patient }: { patient: IPatient }) {
  const [page, setPage] = useState<number>(1);
  const { patientId } = useParams() as { patientId: string };

  const { data: recordsData, isPending: isRecordsPending } = useQuery<
    PaginatedResponse<IRecord>
  >({
    queryKey: ["records", patientId, page],
    queryFn: () => handleGetRecords({ id: patientId, page }),
  });

  const records = recordsData?.data || [];
  const paginationData = recordsData?.meta;

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
        <ConsultationRecordsTable
          records={records}
          isRecordsPending={isRecordsPending}
        />
      </div>

      <PaginationBar
        itemName="Consultation Records"
        paginationData={paginationData!}
        setPage={setPage}
        isLoading={isRecordsPending}
      />
    </div>
  );
}

export default ConsultationRecords;
