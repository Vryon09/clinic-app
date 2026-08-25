import type { IRecordMedications } from "@/types/RecordMedicationsType";
import type { IRecord } from "@/types/RecordType";
import type { IVitalSigns } from "@/types/VitalSignsType";
import { Button } from "../../../shadcn/button";
import { useQuery } from "@tanstack/react-query";
import { handleGetClinicInfo } from "@/services/apiClinicInfo";
import type { ClinicInfoForm } from "@/schemas/clinicInfoSchema";
import { handleGetPatient } from "@/services/apiPatients";
import { useNavigate, useParams } from "react-router";
import type { IPatient } from "@/types/PatientType";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useState } from "react";
import { handleGetSignature } from "@/services/apiSignature";
import { Toggle } from "../../../shadcn/toggle";
import { AlertTriangle } from "lucide-react";

function ConsultationPrintView({
  record,
  vitalSigns,
  recordMedications,
}: {
  record: IRecord;
  vitalSigns: IVitalSigns;
  recordMedications: IRecordMedications[];
}) {
  const [withSignature, setWithSignature] = useState<boolean>(true);
  const navigate = useNavigate();

  const { data: clinicInfo, isPending: isClinicInfoPending } =
    useQuery<ClinicInfoForm>({
      queryFn: handleGetClinicInfo,
      queryKey: ["clinicInfo"],
    });

  const { patientId } = useParams() as { patientId: string };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient"],
  });

  const doctorId = record?.case?.doctor?.id;
  const { data: signatureData, isPending: isSignaturePending } = useQuery({
    queryKey: ["signature", doctorId],
    queryFn: () => {
      if (!doctorId) throw new Error("Doctor ID is required");
      return handleGetSignature(doctorId);
    },
    enabled: !!doctorId,
  });

  return (
    <div className="mx-auto w-[210mm] bg-white p-10 text-black print:w-full print:p-6">
      {/* HEADER */}
      <div className="mb-6 border-b pb-3 text-center">
        <h1 className="text-xl font-bold">
          {clinicInfo?.name ? clinicInfo.name : "ClinicSync"}
        </h1>
        <p className="text-sm">Medical Consultation Report</p>
      </div>

      {/* CONSULTATION DETAILS */}
      <section className="mb-6">
        <h2 className="mb-2 border-b text-sm font-bold">Patient's Details</h2>

        <p className="text-sm">
          <span className="font-semibold">Name:</span>{" "}
          {patient?.firstName || patient?.middleName || patient?.lastName
            ? `${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""} ${patient.lastName}`
            : "N/A"}
        </p>

        <p className="text-sm">
          <span className="font-semibold">Age:</span>{" "}
          {patient?.dateOfBirth
            ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
            : "N/A"}
        </p>

        <p className="text-sm">
          <span className="font-semibold">Date of Birth:</span>{" "}
          {patient?.dateOfBirth
            ? dayjs(patient.dateOfBirth).format("MMMM DD, YYYY")
            : "N/A"}
        </p>

        <p className="text-sm">
          <span className="font-semibold">Sex:</span>{" "}
          <span className="capitalize">
            {patient?.sex ? patient.sex.toLowerCase() : "N/A"}
          </span>
        </p>

        <p className="text-sm">
          <span className="font-semibold">Address:</span>{" "}
          {patient?.address ? patient.address : "N/A"}
        </p>
      </section>

      {/* CONSULTATION DETAILS */}
      <section className="mb-6">
        <h2 className="mb-2 border-b text-sm font-bold">
          Consultation Details
        </h2>

        <p className="text-sm">
          <span className="font-semibold">Symptoms:</span>{" "}
          {record?.symptoms ? record.symptoms : "N/A"}
        </p>

        <p className="text-sm">
          <span className="font-semibold">Signs:</span>{" "}
          {record?.signs ? record.signs : "N/A"}
        </p>

        <p className="text-sm">
          <span className="font-semibold">Diagnosis:</span>{" "}
          {record?.diagnosis ? record.diagnosis : "N/A"}
        </p>
      </section>

      {/* VITAL SIGNS */}
      <section className="mb-6">
        <h2 className="mb-2 border-b text-sm font-bold">Vital Signs</h2>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <p>
            <span className="font-semibold">BP:</span>{" "}
            {vitalSigns?.bloodPressureSystolic &&
            vitalSigns?.bloodPressureDiastolic
              ? `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}`
              : "N/A"}
          </p>

          <p>
            <span className="font-semibold">Temp:</span>{" "}
            {vitalSigns?.temperature ? `${vitalSigns.temperature}°C` : "N/A"}
          </p>

          <p>
            <span className="font-semibold">Weight:</span>{" "}
            {vitalSigns?.weightKg ? `${vitalSigns.weightKg} kg` : "N/A"}
          </p>
        </div>
      </section>

      {/* MEDICATIONS */}
      <section className="mb-6">
        <h2 className="mb-2 border-b text-sm font-bold">Medications</h2>

        {recordMedications.length === 0 && <p className="text-sm">N/A</p>}

        {recordMedications?.map((med, i) => (
          <div key={med.id} className="mb-3 text-sm">
            <p className="font-semibold">
              {i + 1}. {med.name ? med.name : "N/A"}
            </p>

            <p>Dosage: {med.dosage ? med.dosage : "N/A"}</p>

            <p>Frequency: {med.frequency ? med.frequency : "N/A"}</p>

            <p>
              Duration:{" "}
              {med.durationDays
                ? `${med.durationDays} ${med.durationDays > 1 ? "days" : "day"}`
                : "N/A"}
            </p>

            <p>Instructions: {med.instructions ? med.instructions : "N/A"}</p>
          </div>
        ))}
      </section>

      {/* SIGNATURE */}
      <div className="mt-10 text-sm">
        {record.case.doctor?.username && (
          <p>
            Dr.{" "}
            {`${record.case.doctor.firstName}${record.case.doctor.middleName ? ` ${record.case.doctor.middleName.slice(0, 1)}.` : ""} ${record.case.doctor.lastName}`}{" "}
          </p>
        )}
        <div className="relative my-2">
          <p className="relative z-0">
            Doctor’s Signature:{" "}
            <span className="relative inline-block">
              __________________________
              {withSignature && signatureData?.filePath && (
                <img
                  src={`http://localhost:3000/${signatureData.filePath}`}
                  alt="Doctor's Signature"
                  className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-16 max-w-[180px] -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              )}
            </span>
          </p>
        </div>
        {record.case.doctor?.licenseNum && (
          <p>License No.: {record.case.doctor.licenseNum} </p>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-xs text-gray-500">
        Generated by {clinicInfo?.name ? clinicInfo.name : "ClinicSync"}
      </div>

      {/* CONTROLS (PRINT HIDDEN) */}
      <div className="mt-6 flex flex-col gap-3 print:hidden">
        {withSignature && !isSignaturePending && !signatureData?.filePath && (
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Doctor does not have a signature yet. Manage signature in account{" "}
              <span
                className="cursor-pointer font-semibold underline hover:text-amber-950"
                onClick={() => navigate("/settings")}
              >
                settings
              </span>
              .
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Toggle
            variant="outline"
            pressed={withSignature}
            onPressedChange={setWithSignature}
            className="cursor-pointer"
          >
            {withSignature ? "With Signature" : "Without Signature"}
          </Toggle>

          <Button
            onClick={() => {
              if (!record.case.doctor) {
                toast.error(
                  `Record is under "Default" case. Update this record to a case under a doctor.`,
                  { position: "top-center" },
                );

                return;
              }

              if (record.case.doctor.licenseNum === "") {
                toast.error(
                  `Doctor should have a license number. Update the "License Number" in settings -> Accounts -> Change License Number.`,
                  { position: "top-center", duration: 5000 },
                );

                return;
              }

              window.print();
            }}
            className="cursor-pointer bg-[oklch(0.269_0_0)] text-center text-white hover:bg-[oklch(0.269_0_0)]/80"
            disabled={isClinicInfoPending || isPatientPending}
          >
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConsultationPrintView;
