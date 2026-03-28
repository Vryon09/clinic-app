import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { handleGetRecords } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { Pen } from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import ConsultationRecords from "../consultations/ConsultationRecords";

function PatientPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { patientId } = useParams() as { patientId: string };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryKey: ["patient", patientId],
    queryFn: () => handleGetPatient({ id: patientId }),
  });

  const { data: records, isPending: isRecordsPending } = useQuery<IRecord[]>({
    queryKey: ["records", patientId],
    queryFn: () => handleGetRecords(patientId),
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();

  if (isPatientPending || isRecordsPending) return <p>Loading...</p>;
  return (
    <div className="grid grid-cols-2">
      {/* Patient Card */}
      <PatientCard patient={patient!}>
        <div className="flex items-center justify-end">
          <Button
            size="icon-sm"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pen />
          </Button>
        </div>
      </PatientCard>

      <ConsultationRecords patient={patient!} records={records!} />

      {isEditing && (
        <PatientForm
          action="update"
          handlePatient={(data) =>
            handleUpdatePatient({ ...data, id: patientId })
          }
          initialValues={{
            firstName: patient!.firstName,
            lastName: patient!.lastName,
            phone: patient!.phone,
            address: patient!.address,
            sex: patient!.sex,
            dateOfBirth: new Date(patient!.dateOfBirth),
            middleName: patient?.middleName || "",
          }}
          isOpen={isEditing}
          setIsOpen={() => setIsEditing((prev) => !prev)}
        />
      )}
    </div>
  );
}

export default PatientPage;
