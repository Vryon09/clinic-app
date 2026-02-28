import { handleGetPatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";

function PatientPage() {
  const { id } = useParams() as { id: string };

  const { data: patient, isPending } = useQuery<IPatient>({
    queryKey: ["patient", id],
    queryFn: () => handleGetPatient({ id }),
  });

  const navigate = useNavigate();

  console.log(patient);

  if (isPending) return <p>Loading...</p>;

  return (
    <div>
      {/* Patient Card */}
      <div>
        <div>
          <p>name</p>
          <p>{`${patient?.lastName}, ${patient?.firstName}${patient?.middleName ? ` ${patient?.middleName.slice(0, 1)}.` : ""}`}</p>
        </div>

        <div>
          <p>Patient Info</p>
          <div>
            <p>age</p>
            <p>{dayjs().diff(dayjs(patient?.dateOfBirth), "year")}</p>
          </div>
          <div>
            <p>phone</p>
            <p>{patient?.phone}</p>
          </div>
        </div>
      </div>

      <Button
        className="cursor-pointer"
        onClick={() => navigate(`/consultations/${patient?.id}`)}
      >
        Add Consultation
      </Button>

      <div className="space-y-1">
        {patient?.records?.map((record) => (
          <Card className="flex cursor-pointer flex-row justify-between px-4 py-1 hover:bg-neutral-200">
            <p className="text-xs">{record.chiefComplaint}</p>
            <p className="text-xs">
              {dayjs(record.createdAt).format("MMMM DD, YYYY")}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PatientPage;
