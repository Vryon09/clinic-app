import { handleGetPatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { Button } from "../../shadcn/button";

function PatientPage() {
  const { id } = useParams() as { id: string };

  const { data: patient, isPending } = useQuery<IPatient>({
    queryKey: ["patient", id],
    queryFn: () => handleGetPatient({ id }),
  });

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

      <Button className="cursor-pointer">Add Consultation</Button>
    </div>
  );
}

export default PatientPage;
