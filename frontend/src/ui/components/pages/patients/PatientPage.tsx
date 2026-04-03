import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { handleGetRecords } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { PenBox } from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import ConsultationRecords from "../consultations/ConsultationRecords";
import { Card } from "../../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import LabResultSection from "../labResult/LabResultSection";

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
    <div className="flex h-full gap-4">
      {/* Patient Card */}
      <PatientCard patient={patient!}>
        <Button
          size="icon-lg"
          className="mt-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <PenBox className="size-5" />
        </Button>
      </PatientCard>

      <Card className="h-full w-full border-neutral-300 px-2 pt-1 pb-4">
        <Tabs defaultValue="consultations">
          <TabsList variant="line">
            <TabsTrigger value="consultations" className="cursor-pointer">
              Consultations
            </TabsTrigger>
            <TabsTrigger value="lab-results" className="cursor-pointer">
              Lab Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="consultations">
            <ConsultationRecords patient={patient!} records={records!} />
          </TabsContent>

          <TabsContent value="lab-results">
            <LabResultSection />
          </TabsContent>
        </Tabs>
      </Card>

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
