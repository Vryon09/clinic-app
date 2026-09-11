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
import { AlertTriangle } from "lucide-react";
import { handleGetSignature } from "@/services/apiSignature";

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
    retry: false,
    enabled: !!doctorId,
  });

  return (
    <div className="mx-auto w-[210mm] bg-white p-10 text-black shadow-md print:w-full print:p-6 print:shadow-none">
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="mb-8 border-b-2 border-black pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {clinicInfo?.name ? clinicInfo.name : "ClinicSync"}
        </h1>
        <p className="mt-0.5 text-sm text-gray-600">Medical Consultation Report</p>
      </div>

      {/* ── PATIENT DETAILS ────────────────────────── */}
      <section className="mb-6">
        <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          Patient&rsquo;s Details
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <p>
            <span className="font-semibold">Name: </span>
            {patient?.firstName || patient?.middleName || patient?.lastName
              ? `${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""} ${patient.lastName}`
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Sex: </span>
            <span className="capitalize">
              {patient?.sex ? patient.sex.toLowerCase() : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Date of Birth: </span>
            {patient?.dateOfBirth
              ? dayjs(patient.dateOfBirth).format("MMMM DD, YYYY")
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Age: </span>
            {patient?.dateOfBirth
              ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
              : "N/A"}
          </p>
          <p className="col-span-2">
            <span className="font-semibold">Address: </span>
            {patient?.address ? patient.address : "N/A"}
          </p>
        </div>
      </section>

      {/* ── CONSULTATION DETAILS ───────────────────── */}
      <section className="mb-6">
        <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          Consultation Details
        </h2>

        <div className="space-y-1.5 text-sm">
          <p>
            <span className="font-semibold">Symptoms: </span>
            {record?.symptoms ? record.symptoms : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Signs: </span>
            {record?.signs ? record.signs : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Diagnosis: </span>
            {record?.diagnosis ? record.diagnosis : "N/A"}
          </p>
        </div>
      </section>

      {/* ── VITAL SIGNS ────────────────────────────── */}
      <section className="mb-6">
        <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          Vital Signs
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-1 pr-4 font-semibold">Blood Pressure</th>
              <th className="pb-1 pr-4 font-semibold">Temperature</th>
              <th className="pb-1 font-semibold">Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pt-1.5 pr-4">
                {vitalSigns?.bloodPressureSystolic &&
                vitalSigns?.bloodPressureDiastolic
                  ? `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic} mmHg`
                  : "N/A"}
              </td>
              <td className="pt-1.5 pr-4">
                {vitalSigns?.temperature
                  ? `${vitalSigns.temperature}°C`
                  : "N/A"}
              </td>
              <td className="pt-1.5">
                {vitalSigns?.weightKg ? `${vitalSigns.weightKg} kg` : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── MEDICATIONS ────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          Medications
        </h2>

        {recordMedications.length === 0 && (
          <p className="text-sm text-gray-500">N/A</p>
        )}

        {recordMedications?.map((med, i) => (
          <div key={med.id} className="mb-3 text-sm">
            <p className="font-semibold">
              {i + 1}. {med.name ? med.name : "N/A"}
            </p>
            <p className="ml-4 text-gray-700">
              Dosage: {med.dosage ? med.dosage : "N/A"} &nbsp;|&nbsp; Frequency:{" "}
              {med.frequency ? med.frequency : "N/A"} &nbsp;|&nbsp; Duration:{" "}
              {med.durationDays
                ? `${med.durationDays} ${med.durationDays > 1 ? "days" : "day"}`
                : "N/A"}
            </p>
            {med.instructions && (
              <p className="ml-4 text-gray-600">
                Instructions: {med.instructions}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* ── SIGNATURE ──────────────────────────────── */}
      <div className="mt-12 text-sm">
        {record.case.doctor?.username && (
          <p className="mb-1 font-semibold">
            Dr.{" "}
            {`${record.case.doctor.firstName}${record.case.doctor.middleName ? ` ${record.case.doctor.middleName.slice(0, 1)}.` : ""} ${record.case.doctor.lastName}`}
          </p>
        )}
        <div className="relative mb-1">
          <p className="relative z-0">
            Doctor&rsquo;s Signature:{" "}
            <span className="relative inline-block">
              __________________________
              {withSignature && signatureData?.filePath && (
                <img
                  src={`http://localhost:3000/${signatureData.filePath}`}
                  alt="Doctor's Signature"
                  className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-16 max-w-45 -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              )}
            </span>
          </p>
        </div>
        {record.case.doctor?.licenseNum && (
          <p>License No.: {record.case.doctor.licenseNum}</p>
        )}
      </div>

      {/* ── FOOTER ─────────────────────────────────── */}
      <div className="mt-10 border-t border-gray-200 pt-3 text-center text-xs text-gray-400">
        Generated by {clinicInfo?.name ? clinicInfo.name : "ClinicSync"}
      </div>

      {/* ── CONTROLS (hidden when printing) ────────── */}
      <div className="mt-10 flex flex-col gap-3 print:hidden">
        {withSignature && !isSignaturePending && !signatureData && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
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
          {/* Signature toggle */}
          <div className="inline-flex items-center overflow-hidden rounded-full bg-zinc-900 p-1 select-none">
            <button
              type="button"
              onClick={() => setWithSignature(true)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                withSignature
                  ? "bg-white font-semibold text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              With Signature
            </button>
            <button
              type="button"
              onClick={() => setWithSignature(false)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                !withSignature
                  ? "bg-white font-semibold text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Without Signature
            </button>
          </div>

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
            className="cursor-pointer rounded-full"
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
