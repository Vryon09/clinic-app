import { useNavigate } from "react-router";
import { Button } from "../../shadcn/button";
import { Plus } from "lucide-react";
import type { IPatient } from "@/types/PatientType";
import ConsultationRecordsTable from "./recordsTable/ConsultationRecordsTable";

function ConsultationRecords({ patient }: { patient: IPatient }) {
  // const [page, setPage] = useState<number>(1);
  // const { patientId } = useParams() as { patientId: string };

  // const { data: recordsData, isPending: isRecordsPending } = useQuery<
  //   PaginatedResponse<IRecord>
  // >({
  //   queryKey: ["records", patientId, page],
  //   queryFn: () => handleGetRecords({ id: patientId, page }),
  // });

  // const records = recordsData?.data || [];
  // const paginationData = recordsData?.meta;

  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <Button
          onClick={() => navigate(`/patients/${patient?.id}/consultations/new`)}
        >
          <Plus /> Add Consultation
        </Button>
      </div>

      <div className="space-y-1">
        <ConsultationRecordsTable />
      </div>
    </div>
  );
}

export default ConsultationRecords;
