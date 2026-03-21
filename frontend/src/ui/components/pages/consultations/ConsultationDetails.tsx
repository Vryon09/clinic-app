import { handleGetPatient } from "@/services/apiPatients";
import { handleGetRecordMedications } from "@/services/apiRecordMedications";
import { handleGetRecord } from "@/services/apiRecords";
import { handleGetVitalSign } from "@/services/apiVitalSigns";
import type { IPatient } from "@/types/PatientType";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router";

function ConsultationDetails() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: patient } = useQuery<IPatient>({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: record } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { data: recordMedications } = useQuery({
    queryFn: () => handleGetRecordMedications(consultationId),
    queryKey: ["recordMedications", consultationId],
  });

  const { data: vitalSign } = useQuery({
    queryFn: () => handleGetVitalSign(consultationId),
    queryKey: ["vitalSign", consultationId],
  });

  return (
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
