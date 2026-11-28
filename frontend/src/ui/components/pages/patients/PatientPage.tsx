import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { ClipboardList, FileCheck2, Pen, Plus, ReceiptText, Stethoscope, TestTubes } from "lucide-react";
import { useEffect, useState } from "react";
import { savePatientReturnContext } from "@/lib/patientNavigation";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import ConsultationRecords from "../consultations/ConsultationRecords";
import { Card } from "../../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import LabResultSection from "../labResult/LabResultSection";
import BackButton from "../../BackButton";
import { handleGetCases } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import PatientClinicalSummaryBanner from "./PatientClinicalSummaryBanner";
import { PatientBillingTab } from "../billing/PatientBillingTab";
import { PatientLabRequestsTab } from "../labRequests/PatientLabRequestsTab";
import { PatientMedicalCertificatesTab } from "../medicalCertificates/PatientMedicalCertificatesTab";
import { useAccess } from "@/hooks/useAccess";
import { ReadOnlyNotice } from "../../common/FeatureGate";

function PatientPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { patientId } = useParams() as { patientId: string };
  const navigate = useNavigate();
  const { can, isHidden, isReadOnly } = useAccess();

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryKey: ["patient", patientId],
    queryFn: () => handleGetPatient({ id: patientId }),
  });

  const { data: cases, isPending: isCasesLoading } = useQuery<ICase[]>({
    queryKey: ["cases", patientId],
    queryFn: () => handleGetCases({ patientId }),
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();

  useEffect(() => {
    if (patient) {
      savePatientReturnContext({
        returnUrl: `/patients/${patientId}`,
        patientName: `${patient.firstName} ${patient.lastName}`.trim(),
        contextLabel: "Patient Profile",
      });
    }
  }, [patient, patientId]);

  return (
    <div className="flex h-full flex-col space-y-5 pb-8">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BackButton location="/patients" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {patient ? `${patient.lastName}, ${patient.firstName}` : "Patient Details"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Patient Clinical Record &amp; Consultation Timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8.5 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
            onClick={() => navigate(`/patients/${patientId}/lab-requests/print?mode=digital`)}
          >
            <ClipboardList className="size-3.5" />
            <span>New Lab Request</span>
          </Button>
          <Button
            size="sm"
            className="h-8.5 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            onClick={() => navigate(`/patients/${patientId}/consultations/new`)}
          >
            <Plus className="size-3.5" />
            <span>New Consultation</span>
          </Button>
        </div>
      </div>

      {/* Clinical 360 Summary Banner */}
      <PatientClinicalSummaryBanner
        cases={cases}
        patient={patient}
        isCasesLoading={isCasesLoading}
      />

      {/* Main Content: Left Demographic Card + Right Clinical Tabs */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Column: Patient Profile Card */}
        <PatientCard patient={patient!} isPatientPending={isPatientPending}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs font-semibold hover:bg-muted cursor-pointer"
            disabled={isReadOnly("patients") || !can("patient:update")}
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
        <Card className="flex-1 min-w-0 w-full overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-2xs">
          <Tabs
            defaultValue={
              !isHidden("patients.consultations")
                ? "consultations"
                : !isHidden("patients.labRequests")
                  ? "lab-requests"
                  : !isHidden("patients.medicalCertificates")
                    ? "medical-certificates"
                    : !isHidden("patients.labResults")
                      ? "lab-results"
                      : "billing"
            }
            className="w-full gap-0"
          >
            <div className="border-b border-border/60 bg-muted/20 px-4 pt-2.5 sm:px-6">
              <TabsList
                variant="line"
                className="h-auto w-full flex-wrap justify-start gap-x-3 gap-y-1 p-0"
              >
                {!isHidden("patients.consultations") && (
                  <TabsTrigger
                    value="consultations"
                    className="flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0 data-[state=active]:text-primary"
                  >
                    <Stethoscope className="size-3.5" />
                    Consultations
                  </TabsTrigger>
                )}
                {!isHidden("patients.labRequests") && (
                  <TabsTrigger
                    value="lab-requests"
                    className="flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0 data-[state=active]:text-primary"
                  >
                    <ClipboardList className="size-3.5" />
                    Lab Requests
                  </TabsTrigger>
                )}
                {!isHidden("patients.medicalCertificates") && (
                  <TabsTrigger
                    value="medical-certificates"
                    className="flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0 data-[state=active]:text-primary"
                  >
                    <FileCheck2 className="size-3.5" />
                    Med Certs
                  </TabsTrigger>
                )}
                {!isHidden("patients.labResults") && (
                  <TabsTrigger
                    value="lab-results"
                    className="flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0 data-[state=active]:text-primary"
                  >
                    <TestTubes className="size-3.5" />
                    Lab Results
                  </TabsTrigger>
                )}
                {!isHidden("billing") && (
                  <TabsTrigger
                    value="billing"
                    className="flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0 data-[state=active]:text-primary"
                  >
                    <ReceiptText className="size-3.5" />
                    Billing
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="p-6">
              {!isHidden("patients.consultations") && (
                <TabsContent value="consultations" className="mt-0 outline-none space-y-4">
                  <ReadOnlyNotice feature="patients.consultations" label="Consultations" />
                  <ConsultationRecords patient={patient!} />
                </TabsContent>
              )}

              {!isHidden("patients.labRequests") && (
                <TabsContent value="lab-requests" className="mt-0 outline-none space-y-4">
                  <ReadOnlyNotice feature="patients.labRequests" label="Lab Requests" />
                  <PatientLabRequestsTab />
                </TabsContent>
              )}

              {!isHidden("patients.medicalCertificates") && (
                <TabsContent value="medical-certificates" className="mt-0 outline-none space-y-4">
                  <ReadOnlyNotice feature="patients.medicalCertificates" label="Medical Certificates" />
                  <PatientMedicalCertificatesTab />
                </TabsContent>
              )}

              {!isHidden("patients.labResults") && (
                <TabsContent value="lab-results" className="mt-0 outline-none space-y-4">
                  <ReadOnlyNotice feature="patients.labResults" label="Lab Results" />
                  <LabResultSection />
                </TabsContent>
              )}

              {!isHidden("billing") && (
                <TabsContent value="billing" className="mt-0 outline-none p-0 -m-6">
                  <div className="p-6 pb-0 empty:hidden">
                    <ReadOnlyNotice feature="billing" label="Billing" />
                  </div>
                  <PatientBillingTab patientId={patientId} />
                </TabsContent>
              )}
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
              allergies: patient?.allergies || "",
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
