import { handleGetPatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function Patient() {
  const { id } = useParams() as { id: string };

  const { data: patient, isPending } = useQuery<IPatient>({
    queryKey: ["patient", id],
    queryFn: () => handleGetPatient({ id }),
  });

  if (isPending) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <p>name</p>
        <p>{patient?.name}</p>
      </div>

      <div>
        <p>Patient Info</p>
        <div>
          <p>age</p>
          <p>{patient?.age}</p>
        </div>
        <div>
          <p>phone</p>
          <p>{patient?.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default Patient;
