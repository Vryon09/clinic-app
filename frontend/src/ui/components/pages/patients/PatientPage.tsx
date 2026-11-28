import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import {
  ClipboardList,
  FileCheck2,
  Pen,
  Plus,
  ReceiptText,
  Stethoscope,
  TestTubes,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearPatientReturnContextIfMatches,
  savePatientReturnContext,
} from "@/lib/patientNavigation";
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

  const {
    data: patient,
    isPending: isPatientPending,
    isError: isPatientError,
  } = useQuery<IPatient | null>({
    queryKey: ["patient", patientId],
    queryFn: () => handleGetPatient({ id: patientId }),
    retry: false,
  });

  const isPatientMissing =
    !isPatientPending && (isPatientError || !patient || !patient.id);

  const { data: cases, isLoading: isCasesLoading } = useQuery<ICase[]>({
    queryKey: ["cases", patientId],
    queryFn: () => handleGetCases({ patientId }),
    enabled:
      !isHidden("patients.consultations") && !isPatientMissing && !!patient?.id,
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();

  useEffect(() => {
    if (patient?.id) {
      savePatientReturnContext({
        returnUrl: `/patients/${patientId}`,
        patientName: `${patient.firstName} ${patient.lastName}`.trim(),
        contextLabel: "Patient Profile",
      });
    } else if (isPatientMissing && patientId) {
      clearPatientReturnContextIfMatches(patientId);
    }
  }, [patient, patientId, isPatientMissing]);

  if (isPatientMissing) {
    return (
      <div className="flex h-full flex-col space-y-5 pb-8">
        <div className="flex items-center gap-3">
          <BackButton location="/patients" />
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              Patient Not Found
            </h1>
            <p className="text-muted-foreground text-xs">
              This patient record may have been removed or reset.
            </p>
          </div>
        </div>
        <Card className="border-border/80 bg-card flex flex-col items-center justify-center rounded-2xl border p-10 text-center shadow-2xs">
          <div className="bg-muted text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-full">
            <UserX className="size-6" />
          </div>
          <h2 className="text-foreground text-base font-semibold">
            Patient record unavailable
          </h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            The requested patient record does not exist or is no longer
            accessible.
          </p>
          <Button
            size="sm"
            className="mt-5 cursor-pointer rounded-lg text-xs font-semibold"
            onClick={() => navigate("/patients")}
          >
            Return to Patients Directory
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-5 pb-8">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BackButton location="/patients" />
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              {patient
                ? `${patient.lastName}, ${patient.firstName}`
                : "Patient Details"}
            </h1>
            <p className="text-muted-foreground text-xs">
              Patient Clinical Record &amp; Consultation Timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isHidden("patients.labRequests") && (
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-2xs"
              disabled={
                isReadOnly("patients.labRequests") || !can("labRequest:manage")
              }
              onClick={() =>
                navigate(
                  `/patients/${patientId}/lab-requests/print?mode=digital`,
                )
              }
            >
              <ClipboardList className="size-3.5" />
              <span>New Lab Request</span>
            </Button>
          )}
          {!isHidden("patients.consultations") && (
            <Button
              size="sm"
              className="h-8.5 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
              disabled={
                isReadOnly("patients.consultations") || !can("record:create")
              }
              onClick={() =>
                navigate(`/patients/${patientId}/consultations/new`)
              }
            >
              <Plus className="size-3.5" />
              <span>New Consultation</span>
            </Button>
          )}
        </div>
      </div>

      {/* Clinical 360 Summary Banner */}
      <PatientClinicalSummaryBanner
        cases={cases}
        patient={patient ?? undefined}
        isCasesLoading={isCasesLoading}
      />

      {/* Main Content: Left Demographic Card + Right Clinical Tabs */}
      <div className="flex flex-col items-start gap-5 lg:flex-row">
        {/* Left Column: Patient Profile Card */}
        <PatientCard patient={patient!} isPatientPending={isPatientPending}>
          <Button
            variant="outline"
            size="sm"
            className="border-border/80 hover:bg-muted h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
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
        <Card className="border-border/80 bg-card w-full min-w-0 flex-1 overflow-hidden rounded-2xl border p-0 shadow-2xs">
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
            <div className="border-border/60 bg-muted/20 border-b px-4 pt-2.5 sm:px-6">
              <TabsList
                variant="line"
                className="h-auto w-full flex-wrap justify-start gap-x-3 gap-y-1 p-0"
              >
                {!isHidden("patients.consultations") && (
                  <TabsTrigger
                    value="consultations"
                    className="data-[state=active]:text-primary flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0"
                  >
                    <Stethoscope className="size-3.5" />
                    Consultations
                  </TabsTrigger>
                )}
                {!isHidden("patients.labRequests") && (
                  <TabsTrigger
                    value="lab-requests"
                    className="data-[state=active]:text-primary flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0"
                  >
                    <ClipboardList className="size-3.5" />
                    Lab Requests
                  </TabsTrigger>
                )}
                {!isHidden("patients.medicalCertificates") && (
                  <TabsTrigger
                    value="medical-certificates"
                    className="data-[state=active]:text-primary flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0"
                  >
                    <FileCheck2 className="size-3.5" />
                    Med Certs
                  </TabsTrigger>
                )}
                {!isHidden("patients.labResults") && (
                  <TabsTrigger
                    value="lab-results"
                    className="data-[state=active]:text-primary flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0"
                  >
                    <TestTubes className="size-3.5" />
                    Lab Results
                  </TabsTrigger>
                )}
                {!isHidden("billing") && (
                  <TabsTrigger
                    value="billing"
                    className="data-[state=active]:text-primary flex-none cursor-pointer gap-1.5 px-2 py-2.5 text-xs font-semibold after:bottom-0"
                  >
                    <ReceiptText className="size-3.5" />
                    Billing
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="p-6">
              {!isHidden("patients.consultations") && (
                <TabsContent
                  value="consultations"
                  className="mt-0 space-y-4 outline-none"
                >
                  <ReadOnlyNotice
                    feature="patients.consultations"
                    label="Consultations"
                  />
                  <ConsultationRecords patient={patient!} />
                </TabsContent>
              )}

              {!isHidden("patients.labRequests") && (
                <TabsContent
                  value="lab-requests"
                  className="mt-0 space-y-4 outline-none"
                >
                  <ReadOnlyNotice
                    feature="patients.labRequests"
                    label="Lab Requests"
                  />
                  <PatientLabRequestsTab />
                </TabsContent>
              )}

              {!isHidden("patients.medicalCertificates") && (
                <TabsContent
                  value="medical-certificates"
                  className="mt-0 space-y-4 outline-none"
                >
                  <ReadOnlyNotice
                    feature="patients.medicalCertificates"
                    label="Medical Certificates"
                  />
                  <PatientMedicalCertificatesTab />
                </TabsContent>
              )}

              {!isHidden("patients.labResults") && (
                <TabsContent
                  value="lab-results"
                  className="mt-0 space-y-4 outline-none"
                >
                  <ReadOnlyNotice
                    feature="patients.labResults"
                    label="Lab Results"
                  />
                  <LabResultSection />
                </TabsContent>
              )}

              {!isHidden("billing") && (
                <TabsContent
                  value="billing"
                  className="-m-6 mt-0 p-0 outline-none"
                >
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
