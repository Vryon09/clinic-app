import { handleGetPatient } from "@/services/apiPatients";
import { handleGetRecord } from "@/services/apiRecords";
import type { IPatient } from "@/types/PatientType";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PatientCard from "../patients/PatientCard";

function ConsultationDetails() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: record } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  return (
    <div>
      {!isPatientPending && <PatientCard patient={patient!} />}

      <div className="mt-4">
        <p>Visit Details</p>
        <p>Symptoms: {record?.symptoms}</p>
        <p>Signs: {record?.signs}</p>
        <p>Diagnosis: {record?.diagnosis}</p>
      </div>
    </div>
  );
}

export default ConsultationDetails;
