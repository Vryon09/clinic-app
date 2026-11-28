import dayjs from "dayjs";
import { Check } from "lucide-react";
import type { IClinicInfo } from "@/types/ClinicInfo";
import type { IPatient } from "@/types/PatientType";
import type {
  IMedCertDoctor,
  IMedCertLabResults,
  IMedCertPhysicalExam,
  IMedCertVitalSigns,
  MedicalCertificateTemplateType,
} from "@/types/MedicalCertificateType";
import { formatUserName } from "@/lib/utils";
import {
  DEFAULT_PHYSICAL_EXAM,
  FITNESS_CLASS_OPTIONS,
  LAB_RESULT_LEFT_FIELDS,
  LAB_RESULT_RIGHT_FIELDS,
  PHYSICAL_EXAM_FIELDS,
} from "./medicalCertificateCatalog";

interface MedicalCertificateDocumentProps {
  clinicInfo?: IClinicInfo;
  patient?: IPatient;
  doctor?: IMedCertDoctor | null;
  signatureFilePath?: string | null;
  templateType: MedicalCertificateTemplateType;
  certificateDate: string;
  mode: "digital" | "manual";
  dateSeen: string;
  reasonForVisit: string;
  vitalSigns: IMedCertVitalSigns;
  physicalExam: IMedCertPhysicalExam;
  labResults: IMedCertLabResults;
  fitnessClass: string;
  diagnosis: string;
  remarks: string;
  purpose: string;
  withLogo: boolean;
  logoPosition: "left" | "center" | "right";
  withSignature: boolean;
  interactive?: boolean;
  onDateSeenChange?: (val: string) => void;
  onReasonForVisitChange?: (val: string) => void;
  onVitalSignChange?: (key: keyof IMedCertVitalSigns, val: string) => void;
  onPhysicalExamChange?: (key: keyof IMedCertPhysicalExam, val: string) => void;
  onLabResultChange?: (key: keyof IMedCertLabResults, val: string) => void;
  onFitnessClassChange?: (val: string) => void;
  onDiagnosisChange?: (val: string) => void;
  onRemarksChange?: (val: string) => void;
  onPurposeChange?: (val: string) => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-1.5 border-l-[3px] border-[#1f3d38] bg-[#f0f4f3] px-2 py-1">
      <h2 className="text-[10px] font-bold tracking-wider text-[#1f3d38] uppercase">
        {title}
      </h2>
    </div>
  );
}

function InlineField({
  value,
  placeholder,
  manual,
  interactive,
  onChange,
  widthClass = "w-32",
}: {
  value: string;
  placeholder?: string;
  manual: boolean;
  interactive?: boolean;
  onChange?: (v: string) => void;
  widthClass?: string;
}) {
  if (manual) {
    return (
      <span
        className={`inline-block border-b border-slate-500 align-bottom ${widthClass}`}
      >
        &nbsp;
      </span>
    );
  }
  if (interactive) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`inline-block border-b border-slate-400 bg-transparent px-1 text-center text-xs font-semibold text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent ${widthClass}`}
      />
    );
  }
  return (
    <span
      className={`inline-block border-b border-slate-400 px-1 text-center text-xs font-semibold text-slate-900 ${widthClass}`}
    >
      {value || "\u00A0"}
    </span>
  );
}

export function MedicalCertificateDocument({
  clinicInfo,
  patient,
  doctor,
  signatureFilePath,
  templateType,
  certificateDate,
  mode,
  dateSeen,
  reasonForVisit,
  vitalSigns,
  physicalExam,
  labResults,
  fitnessClass,
  diagnosis,
  remarks,
  purpose,
  withLogo,
  logoPosition,
  withSignature,
  interactive = false,
  onDateSeenChange,
  onReasonForVisitChange,
  onVitalSignChange,
  onPhysicalExamChange,
  onLabResultChange,
  onFitnessClassChange,
  onDiagnosisChange,
  onRemarksChange,
  onPurposeChange,
}: MedicalCertificateDocumentProps) {
  const isManual = mode === "manual";
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const logoUrl = clinicInfo?.logoPath ? `${apiUrl}/${clinicInfo.logoPath}` : null;

  const patientAge = patient?.dateOfBirth
    ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
    : null;

  const formattedPatientName = patient
    ? `${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""} ${patient.lastName}`
    : "";

  const formattedDoctorName = doctor
    ? formatUserName(doctor, { includeMiddle: true, useMiddleInitial: true })
    : "";

  const clinicName = clinicInfo?.name || "ClinicSync";
  const isPreEmployment = templateType === "PRE_EMPLOYMENT_PE";
  const isConsultation = templateType === "CONSULTATION_DIAGNOSIS";
  const isGeneral = templateType === "GENERAL_CLEARANCE";

  const templateSubtitle = isPreEmployment
    ? "Physical Examination Report"
    : isConsultation
      ? "Consultation & Diagnosis"
      : "Medical Clearance";

  const renderVitalSigns = () => (
    <div className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="text-[10px] font-bold tracking-wider text-[#1f3d38] uppercase">
          Vital Signs:
        </span>
        <label className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">Temp:</span>
          <InlineField
            value={vitalSigns.temp || ""}
            placeholder="36.5 °C"
            manual={isManual}
            interactive={interactive}
            onChange={(v) => onVitalSignChange?.("temp", v)}
            widthClass="w-20"
          />
        </label>
        <label className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">Heart Rate:</span>
          <InlineField
            value={vitalSigns.heartRate || ""}
            placeholder="72 bpm"
            manual={isManual}
            interactive={interactive}
            onChange={(v) => onVitalSignChange?.("heartRate", v)}
            widthClass="w-20"
          />
        </label>
        <label className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">Resp. Rate:</span>
          <InlineField
            value={vitalSigns.respiratoryRate || ""}
            placeholder="18 cpm"
            manual={isManual}
            interactive={interactive}
            onChange={(v) => onVitalSignChange?.("respiratoryRate", v)}
            widthClass="w-20"
          />
        </label>
        <label className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">BP:</span>
          <InlineField
            value={vitalSigns.bp || ""}
            placeholder="120/80 mmHg"
            manual={isManual}
            interactive={interactive}
            onChange={(v) => onVitalSignChange?.("bp", v)}
            widthClass="w-24"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div
      className="mx-auto w-[210mm] bg-white text-slate-900 shadow-md print:w-full print:shadow-none"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* Top Clinical Accent Bar (copied from LabRequestSlipDocument) */}
      <div className="h-2 w-full bg-[#1f3d38]" />

      <div
        className={`px-8 ${isPreEmployment ? "py-5 print:px-6 print:py-4" : "py-7 print:px-6 print:py-5"}`}
      >
        {/* ── HEADER (copied from LabRequestSlipDocument) ────── */}
        <header className="mb-4 border-b border-slate-200 pb-3.5">
          {withLogo && logoUrl ? (
            logoPosition === "center" ? (
              <div className="flex flex-col items-center text-center">
                <img
                  src={logoUrl}
                  alt="Clinic Logo"
                  className="mb-2 h-14 w-auto max-w-44 object-contain"
                />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {clinicName}
                </h1>
                {(clinicInfo?.address || clinicInfo?.phone) && (
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {[clinicInfo.address, clinicInfo.phone]
                      .filter(Boolean)
                      .join("  •  ")}
                  </p>
                )}
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f0f4f3] px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#1f3d38] uppercase">
                  Medical Certificate &middot; {templateSubtitle}
                </div>
              </div>
            ) : logoPosition === "left" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={logoUrl}
                    alt="Clinic Logo"
                    className="h-14 w-auto max-w-36 shrink-0 object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                      {clinicName}
                    </h1>
                    {clinicInfo?.address && (
                      <p className="text-[11px] text-slate-500">
                        {clinicInfo.address}
                      </p>
                    )}
                    {clinicInfo?.phone && (
                      <p className="text-[11px] text-slate-500">
                        Tel: {clinicInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded bg-[#1f3d38] px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                    Medical Certificate
                  </span>
                  <p className="mt-1 text-[10px] font-medium text-slate-500">
                    {templateSubtitle}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="mb-1 inline-block rounded bg-[#1f3d38] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
                    Medical Certificate
                  </span>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {clinicName}
                  </h1>
                  {(clinicInfo?.address || clinicInfo?.phone) && (
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {[clinicInfo.address, clinicInfo.phone]
                        .filter(Boolean)
                        .join("  •  ")}
                    </p>
                  )}
                </div>
                <img
                  src={logoUrl}
                  alt="Clinic Logo"
                  className="h-14 w-auto max-w-36 shrink-0 object-contain"
                />
              </div>
            )
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {clinicName}
                </h1>
                {(clinicInfo?.address || clinicInfo?.phone) && (
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {[clinicInfo.address, clinicInfo.phone]
                      .filter(Boolean)
                      .join("  •  ")}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="inline-block rounded bg-[#1f3d38] px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                  Medical Certificate
                </span>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  {templateSubtitle}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* ── TITLE & DATE ROW ───────────────────────────────── */}
        <div className="mb-4 flex items-end justify-between">
          <p className="text-xs font-bold tracking-wider text-slate-800 uppercase">
            To Whom It May Concern:
          </p>
          <div className="text-right text-xs">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Date:{" "}
            </span>
            {isManual ? (
              <span className="inline-block w-32 border-b border-slate-500">
                &nbsp;
              </span>
            ) : (
              <span className="inline-block min-w-28 border-b border-slate-400 px-1 text-center font-semibold text-slate-900">
                {certificateDate
                  ? dayjs(certificateDate).format("MMMM DD, YYYY")
                  : "—"}
              </span>
            )}
          </div>
        </div>

        {/* ── CERTIFICATION STATEMENT ────────────────────────── */}
        <section className="mb-4 text-[13px] leading-relaxed text-slate-800">
          {isConsultation ? (
            <p className="indent-8">
              This is to certify that Mr./Mrs./Ms.{" "}
              <span className="inline-block min-w-52 border-b border-slate-400 px-1.5 text-center font-bold text-slate-900 uppercase">
                {isManual ? "\u00A0" : formattedPatientName || "—"}
              </span>
              ,{" "}
              <span className="inline-block min-w-12 border-b border-slate-400 px-1 text-center font-semibold text-slate-900">
                {isManual ? "\u00A0" : patientAge !== null ? patientAge : "—"}
              </span>{" "}
              years old and a resident of{" "}
              <span className="inline-block min-w-56 border-b border-slate-400 px-1.5 text-center font-semibold text-slate-900">
                {isManual ? "\u00A0" : patient?.address || "—"}
              </span>{" "}
              was seen in my clinic on{" "}
              <InlineField
                value={
                  dateSeen ? dayjs(dateSeen).format("MMM DD, YYYY") : ""
                }
                placeholder="Date seen"
                manual={isManual}
                interactive={interactive}
                onChange={onDateSeenChange}
                widthClass="w-36"
              />{" "}
              because of{" "}
              <InlineField
                value={reasonForVisit}
                placeholder="Chief complaint / reason for visit"
                manual={isManual}
                interactive={interactive}
                onChange={onReasonForVisitChange}
                widthClass="w-72"
              />
              .
            </p>
          ) : (
            <p className="indent-8">
              This is to certify that Mr./Mrs./Ms.{" "}
              <span className="inline-block min-w-52 border-b border-slate-400 px-1.5 text-center font-bold text-slate-900 uppercase">
                {isManual ? "\u00A0" : formattedPatientName || "—"}
              </span>
              ,{" "}
              <span className="inline-block min-w-12 border-b border-slate-400 px-1 text-center font-semibold text-slate-900">
                {isManual ? "\u00A0" : patientAge !== null ? patientAge : "—"}
              </span>{" "}
              years old and a resident of{" "}
              <span className="inline-block min-w-56 border-b border-slate-400 px-1.5 text-center font-semibold text-slate-900">
                {isManual ? "\u00A0" : patient?.address || "—"}
              </span>{" "}
              consulted my services for a general physical check-up.
            </p>
          )}
        </section>

        {/* ── TEMPLATE 1: GENERAL CLEARANCE ─────────────────── */}
        {isGeneral && (
          <div className="space-y-5">
            {renderVitalSigns()}

            <p className="indent-8 text-[13px] leading-relaxed text-slate-800">
              This further certifies that physical examination done showed that
              he/she is{" "}
              <span className="font-bold text-slate-950">
                physically and mentally fit at the time of examination.
              </span>
            </p>

            <div>
              <SectionHeader title="Remarks" />
              {isManual ? (
                <div className="space-y-4 pt-3">
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                </div>
              ) : interactive ? (
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => onRemarksChange?.(e.target.value)}
                  placeholder="Enter clinical remarks or recommendations..."
                  className="w-full resize-none rounded-md border border-slate-300 bg-transparent px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:border-slate-300 print:placeholder:text-transparent"
                />
              ) : (
                <div className="min-h-[68px] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium whitespace-pre-wrap text-slate-900">
                  {remarks || ""}
                </div>
              )}
            </div>

            <p className="pt-2 text-[12.5px] leading-relaxed text-slate-800">
              This certification has been issued upon his/her request in
              connection with his/her application for{" "}
              <InlineField
                value={purpose}
                placeholder="employment / school entrance / purpose"
                manual={isManual}
                interactive={interactive}
                onChange={onPurposeChange}
                widthClass="w-64"
              />{" "}
              and/or for whatever good purpose this may serve.
            </p>
          </div>
        )}

        {/* ── TEMPLATE 2: CONSULTATION & DIAGNOSIS ──────────── */}
        {isConsultation && (
          <div className="space-y-5">
            <div>
              <SectionHeader title="Diagnosis" />
              {isManual ? (
                <div className="space-y-5 pt-3">
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                </div>
              ) : interactive ? (
                <textarea
                  rows={4}
                  value={diagnosis}
                  onChange={(e) => onDiagnosisChange?.(e.target.value)}
                  placeholder="Enter clinical diagnosis..."
                  className="w-full resize-none rounded-md border border-slate-300 bg-transparent px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:border-slate-300 print:placeholder:text-transparent"
                />
              ) : (
                <div className="min-h-[84px] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium whitespace-pre-wrap text-slate-900">
                  {diagnosis || ""}
                </div>
              )}
            </div>

            <div>
              <SectionHeader title="Remarks / Recommendations" />
              {isManual ? (
                <div className="space-y-5 pt-3">
                  <div className="border-b border-slate-400" />
                  <div className="border-b border-slate-400" />
                </div>
              ) : interactive ? (
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => onRemarksChange?.(e.target.value)}
                  placeholder="Enter rest days, medication advice, or recommendations..."
                  className="w-full resize-none rounded-md border border-slate-300 bg-transparent px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:border-slate-300 print:placeholder:text-transparent"
                />
              ) : (
                <div className="min-h-[60px] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium whitespace-pre-wrap text-slate-900">
                  {remarks || ""}
                </div>
              )}
            </div>

            <p className="pt-2 text-xs font-semibold italic text-slate-700">
              * This medical certificate is issued for whatever purpose it may
              serve him/her except for medico-legal.
            </p>
          </div>
        )}

        {/* ── TEMPLATE 3: PRE-EMPLOYMENT / COMPREHENSIVE PE ─── */}
        {isPreEmployment && (
          <div className="space-y-3">
            {renderVitalSigns()}

            {/* Physical Examination (7 Systems) */}
            <div className="rounded-md border border-slate-200 p-2.5">
              <SectionHeader title="Physical Examination" />
              <div className="space-y-1 text-[11px]">
                {PHYSICAL_EXAM_FIELDS.map(({ key, label }) => {
                  const val =
                    physicalExam[key] ?? DEFAULT_PHYSICAL_EXAM[key] ?? "";
                  return (
                    <div key={key} className="flex items-baseline gap-2">
                      <span className="w-36 shrink-0 font-bold text-[#1f3d38]">
                        {label}:
                      </span>
                      {interactive && !isManual ? (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            onPhysicalExamChange?.(key, e.target.value)
                          }
                          className="w-full border-b border-transparent bg-transparent text-[11px] font-medium text-slate-800 outline-none hover:border-slate-300 focus:border-[#1f3d38]"
                        />
                      ) : (
                        <span className="text-slate-800">
                          {isManual ? DEFAULT_PHYSICAL_EXAM[key] : val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Laboratory and Diagnostic Examination */}
            <div className="rounded-md border border-slate-200 p-2.5">
              <SectionHeader title="Laboratory and Diagnostic Examination" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                <div className="space-y-1.5">
                  {LAB_RESULT_LEFT_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-36 shrink-0 font-medium text-slate-700">
                        {label}:
                      </span>
                      {isManual ? (
                        <div className="h-3.5 flex-1 border-b border-slate-400" />
                      ) : interactive ? (
                        <input
                          type="text"
                          value={labResults[key] || ""}
                          onChange={(e) =>
                            onLabResultChange?.(key, e.target.value)
                          }
                          placeholder="Normal / Result"
                          className="flex-1 border-b border-slate-300 bg-transparent text-[11px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                        />
                      ) : (
                        <div className="min-h-[14px] flex-1 border-b border-slate-300 text-[11px] font-medium text-slate-900">
                          {labResults[key] || ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {LAB_RESULT_RIGHT_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-32 shrink-0 font-medium text-slate-700">
                        {label}:
                      </span>
                      {isManual ? (
                        <div className="h-3.5 flex-1 border-b border-slate-400" />
                      ) : interactive ? (
                        <input
                          type="text"
                          value={labResults[key] || ""}
                          onChange={(e) =>
                            onLabResultChange?.(key, e.target.value)
                          }
                          placeholder="Normal / Result"
                          className="flex-1 border-b border-slate-300 bg-transparent text-[11px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                        />
                      ) : (
                        <div className="min-h-[14px] flex-1 border-b border-slate-300 text-[11px] font-medium text-slate-900">
                          {labResults[key] || ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Medical Report on Physical Examination (Class A - D) */}
            <div className="rounded-md border border-slate-200 p-2.5">
              <SectionHeader title="Medical Report on Physical Examination" />
              <div className="space-y-1 text-[11px]">
                {FITNESS_CLASS_OPTIONS.map((opt) => {
                  const isChecked = !isManual && fitnessClass === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={
                        !isManual && interactive
                          ? () =>
                              onFitnessClassChange?.(
                                isChecked ? "" : opt.value,
                              )
                          : undefined
                      }
                      className={`flex items-start gap-2 rounded px-1 py-0.5 ${
                        !isManual && interactive
                          ? "cursor-pointer hover:bg-[#f0f4f3] print:hover:bg-transparent"
                          : ""
                      }`}
                    >
                      <span
                        className={`mt-[1.5px] inline-flex h-[12px] w-[12px] shrink-0 items-center justify-center rounded-[2px] border ${
                          isChecked
                            ? "border-[#1f3d38] bg-[#1f3d38] text-white"
                            : "border-slate-500 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={
                          isChecked
                            ? "font-bold text-slate-950"
                            : "font-medium text-slate-800"
                        }
                      >
                        {opt.code} &ndash; {opt.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnosis & Remarks */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SectionHeader title="Diagnosis" />
                {isManual ? (
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-slate-400" />
                    <div className="border-b border-slate-400" />
                  </div>
                ) : interactive ? (
                  <textarea
                    rows={2}
                    value={diagnosis}
                    onChange={(e) => onDiagnosisChange?.(e.target.value)}
                    placeholder="Enter diagnosis (if any)..."
                    className="w-full resize-none rounded border border-slate-300 bg-transparent px-2 py-1.5 text-[11px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                  />
                ) : (
                  <div className="min-h-[44px] rounded border border-slate-200 px-2 py-1.5 text-[11px] font-medium whitespace-pre-wrap text-slate-900">
                    {diagnosis || ""}
                  </div>
                )}
              </div>

              <div>
                <SectionHeader title="Remarks / Recommendations" />
                {isManual ? (
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-slate-400" />
                    <div className="border-b border-slate-400" />
                  </div>
                ) : interactive ? (
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => onRemarksChange?.(e.target.value)}
                    placeholder="Enter remarks..."
                    className="w-full resize-none rounded border border-slate-300 bg-transparent px-2 py-1.5 text-[11px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                  />
                ) : (
                  <div className="min-h-[44px] rounded border border-slate-200 px-2 py-1.5 text-[11px] font-medium whitespace-pre-wrap text-slate-900">
                    {remarks || ""}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11.5px] leading-snug text-slate-800">
              This certification has been issued upon his/her request in
              connection with his/her application for{" "}
              <InlineField
                value={purpose}
                placeholder="employment / school entrance / purpose"
                manual={isManual}
                interactive={interactive}
                onChange={onPurposeChange}
                widthClass="w-56"
              />{" "}
              and/or for whatever good purpose this may serve.
            </p>
          </div>
        )}

        {/* ── PHYSICIAN SIGNATURE FOOTER ────────────────────── */}
        <footer className="mt-8 flex justify-end pt-2">
          <div className="inline-block w-full max-w-[260px] text-center">
            <p className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
              {isPreEmployment ? "Examining Physician" : "Attending Physician"}
            </p>

            <div className="relative mt-8 mb-1">
              {withSignature && signatureFilePath && (
                <img
                  src={`${apiUrl}/${signatureFilePath}`}
                  alt="Physician Signature"
                  className="pointer-events-none absolute -top-9 left-1/2 h-12 max-w-36 -translate-x-1/2 object-contain"
                />
              )}
              <div className="border-b border-slate-700 pb-0.5 text-xs font-bold text-slate-900">
                {formattedDoctorName
                  ? `${formattedDoctorName}, M.D.`
                  : "_______________________, M.D."}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 text-[10px] text-slate-600">
              <span>
                {isPreEmployment ? "License No.:" : "PRC No.:"}{" "}
                {doctor?.licenseNum || "____________"}
              </span>
              {clinicInfo?.phone && <span>&bull;</span>}
              {clinicInfo?.phone && <span>{clinicInfo.phone}</span>}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
