import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { Pen, Stethoscope, TestTubes } from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import ConsultationRecords from "../consultations/ConsultationRecords";
import { Card } from "../../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import LabResultSection from "../labResult/LabResultSection";
import BackButton from "../../BackButton";

function PatientPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { patientId } = useParams() as { patientId: string };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryKey: ["patient", patientId],
    queryFn: () => handleGetPatient({ id: patientId }),
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();

  return (
    <div className="flex h-full flex-col space-y-4 pb-8">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton location="/patients" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {patient ? `${patient.lastName}, ${patient.firstName}` : "Patient Details"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Patient Clinical Record & Consultation Timeline
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Left Demographic Card + Right Clinical Tabs */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Column: Patient Profile Card */}
        <PatientCard patient={patient!} isPatientPending={isPatientPending}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs font-semibold hover:bg-muted cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pen className="size-3.5" />
            <span>Edit Demographics</span>
          </Button>
        </PatientCard>

        {/* Right Column: Encounters & Lab Results Tabs */}
        <Card className="flex-1 w-full overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-2xs">
          <Tabs defaultValue="consultations" className="w-full">
            <div className="border-b border-border/60 bg-muted/20 px-6 pt-3">
              <TabsList variant="line" className="gap-4">
                <TabsTrigger
                  value="consultations"
                  className="cursor-pointer gap-2 py-2.5 text-xs font-semibold data-[state=active]:text-primary"
                >
                  <Stethoscope className="size-3.5" />
                  Consultation Records
                </TabsTrigger>
                <TabsTrigger
                  value="lab-results"
                  className="cursor-pointer gap-2 py-2.5 text-xs font-semibold data-[state=active]:text-primary"
                >
                  <TestTubes className="size-3.5" />
                  Laboratory Results
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="consultations" className="mt-0 outline-none">
                <ConsultationRecords patient={patient!} />
              </TabsContent>

              <TabsContent value="lab-results" className="mt-0 outline-none">
                <LabResultSection />
              </TabsContent>
            </div>
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
    </div>
  );
}

export default PatientPage;
