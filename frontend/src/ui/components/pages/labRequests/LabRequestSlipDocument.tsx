import dayjs from "dayjs";
import { Check } from "lucide-react";
import type { IClinicInfo } from "@/types/ClinicInfo";
import type { IPatient } from "@/types/PatientType";
import type {
  ILabRequestCustomTests,
  ILabRequestDoctor,
  ILabRequestSelectedTests,
  LabRequestCategoryKey,
} from "@/types/LabRequestType";
import { formatUserName } from "@/lib/utils";
import {
  BLOOD_CHEM_COL1_COUNT,
  LAB_REQUEST_CATEGORIES,
} from "./labRequestCatalog";

interface LabRequestSlipDocumentProps {
  clinicInfo?: IClinicInfo;
  patient?: IPatient;
  doctor?: ILabRequestDoctor | null;
  signatureFilePath?: string | null;
  requestDate: string;
  mode: "digital" | "manual";
  selectedTests: ILabRequestSelectedTests;
  customTests: ILabRequestCustomTests;
  otherExaminations: string;
  withLogo: boolean;
  logoPosition: "left" | "center" | "right";
  withSignature: boolean;
  interactive?: boolean;
  onToggleTest?: (category: LabRequestCategoryKey, testName: string) => void;
  onCustomTestChange?: (
    key: keyof ILabRequestCustomTests,
    value: string,
  ) => void;
  onOtherExaminationsChange?: (value: string) => void;
}

function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="mb-1.5 border-l-[3px] border-[#1f3d38] bg-[#f0f4f3] px-2 py-1">
      <h2 className="text-[10px] font-bold tracking-wider text-[#1f3d38] uppercase">
        {title}
      </h2>
    </div>
  );
}

function SlipCheckbox({
  label,
  checked,
  manual,
  interactive,
  onClick,
}: {
  label: string;
  checked: boolean;
  manual: boolean;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const isChecked = !manual && checked;

  return (
    <div
      onClick={!manual && interactive ? onClick : undefined}
      className={`flex items-start gap-1.5 rounded px-1 py-[2px] leading-snug ${
        !manual && interactive
          ? "cursor-pointer transition-colors hover:bg-[#f0f4f3] print:hover:bg-transparent"
          : ""
      }`}
    >
      <span
        className={`mt-[1.5px] inline-flex h-[12px] w-[12px] shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
          isChecked
            ? "border-[#1f3d38] bg-[#1f3d38] text-white"
            : "border-slate-500 bg-white"
        }`}
      >
        {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
      </span>
      <span
        className={`text-[10.5px] ${
          isChecked
            ? "font-semibold text-slate-950"
            : "font-medium text-slate-800"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function LabRequestSlipDocument({
  clinicInfo,
  patient,
  doctor,
  signatureFilePath,
  requestDate,
  mode,
  selectedTests,
  customTests,
  otherExaminations,
  withLogo,
  logoPosition,
  withSignature,
  interactive = false,
  onToggleTest,
  onCustomTestChange,
  onOtherExaminationsChange,
}: LabRequestSlipDocumentProps) {
  const isManual = mode === "manual";
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const logoUrl = clinicInfo?.logoPath ? `${apiUrl}/${clinicInfo.logoPath}` : null;

  const isSelected = (cat: LabRequestCategoryKey, item: string) =>
    Boolean(selectedTests[cat]?.includes(item));

  const labCat = LAB_REQUEST_CATEGORIES.find((c) => c.key === "laboratory")!;
  const bloodChemCat = LAB_REQUEST_CATEGORIES.find(
    (c) => c.key === "bloodChemistry",
  )!;
  const ultrasoundCat = LAB_REQUEST_CATEGORIES.find(
    (c) => c.key === "ultrasound",
  )!;
  const xrayCat = LAB_REQUEST_CATEGORIES.find((c) => c.key === "xray")!;
  const echoCat = LAB_REQUEST_CATEGORIES.find((c) => c.key === "twoDEcho")!;
  const ecgCat = LAB_REQUEST_CATEGORIES.find((c) => c.key === "ecg")!;

  const bloodChemCol1 = bloodChemCat.items.slice(0, BLOOD_CHEM_COL1_COUNT);
  const bloodChemCol2 = bloodChemCat.items.slice(BLOOD_CHEM_COL1_COUNT);

  const patientAge = patient?.dateOfBirth
    ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
    : null;

  const formattedDoctorName = doctor
    ? formatUserName(doctor, { includeMiddle: true, useMiddleInitial: true })
    : "";

  const clinicName = clinicInfo?.name || "ClinicSync";

  return (
    <div
      className="mx-auto w-[210mm] bg-white text-slate-900 shadow-md print:w-full print:shadow-none"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* Top Clinical Accent Bar */}
      <div className="h-2 w-full bg-[#1f3d38]" />

      <div className="px-7 py-5 print:px-5 print:py-4">
        {/* ── HEADER ────────────────────────────────────────── */}
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
                  Laboratory &amp; Diagnostic Request
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
                    Lab Request Form
                  </span>
                  <p className="mt-1 text-[10px] font-medium text-slate-500">
                    Diagnostic Referral Slip
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="mb-1 inline-block rounded bg-[#1f3d38] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
                    Lab Request Form
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
                  Lab Request Form
                </span>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  Diagnostic Referral Slip
                </p>
              </div>
            </div>
          )}
        </header>

        {/* ── PATIENT DETAILS CARD ──────────────────────────── */}
        <section className="mb-4 rounded-md border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
          <div className="grid grid-cols-12 gap-x-4 gap-y-2 text-xs">
            <div className="col-span-6">
              <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Patient Name
              </span>
              <span className="font-bold text-slate-900 uppercase">
                {patient
                  ? `${patient.lastName}, ${patient.firstName}${
                      patient.middleName
                        ? ` ${patient.middleName.slice(0, 1)}.`
                        : ""
                    }`
                  : "—"}
              </span>
            </div>

            <div className="col-span-2">
              <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Age / Sex
              </span>
              <span className="font-semibold text-slate-800 capitalize">
                {patientAge !== null ? `${patientAge} yrs` : "—"}
                {patient?.sex ? ` • ${patient.sex.toLowerCase()}` : ""}
              </span>
            </div>

            <div className="col-span-2">
              <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Contact No.
              </span>
              <span className="font-semibold text-slate-800">
                {patient?.phone || "—"}
              </span>
            </div>

            <div className="col-span-2 text-right">
              <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Request Date
              </span>
              <span className="font-semibold text-slate-900">
                {requestDate ? dayjs(requestDate).format("MMM DD, YYYY") : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* ── DIAGNOSTIC CHECKLIST GRID ─────────────────────── */}
        <section className="mb-4 grid grid-cols-12 gap-3">
          {/* COL 1: LABORATORY + ECG */}
          <div className="col-span-3 flex flex-col justify-between rounded-md border border-slate-200 p-2">
            <div>
              <CategoryHeader title={labCat.title} />
              <div className="space-y-0.5">
                {labCat.items.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("laboratory", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("laboratory", item)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-2.5 border-t border-slate-200 pt-2">
              <CategoryHeader title={ecgCat.title} />
              <div className="space-y-0.5">
                {ecgCat.items.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("ecg", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("ecg", item)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* COL 2: BLOOD CHEMISTRY */}
          <div className="col-span-4 rounded-md border border-slate-200 p-2">
            <CategoryHeader title={bloodChemCat.title} />
            <div className="grid grid-cols-2 gap-x-2">
              <div className="space-y-0.5">
                {bloodChemCol1.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("bloodChemistry", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("bloodChemistry", item)}
                  />
                ))}
              </div>
              <div className="space-y-0.5">
                {bloodChemCol2.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("bloodChemistry", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("bloodChemistry", item)}
                  />
                ))}

                {/* Others under Blood Chemistry */}
                <div className="pt-1">
                  <SlipCheckbox
                    label="Others"
                    checked={
                      isSelected("bloodChemistry", "Others") ||
                      Boolean(customTests.bloodChemistryOthers?.trim())
                    }
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("bloodChemistry", "Others")}
                  />
                  {isManual ? (
                    <div className="mt-1 ml-4 h-3 border-b border-slate-400" />
                  ) : interactive ? (
                    <input
                      type="text"
                      value={customTests.bloodChemistryOthers || ""}
                      onChange={(e) =>
                        onCustomTestChange?.(
                          "bloodChemistryOthers",
                          e.target.value,
                        )
                      }
                      placeholder="Specify..."
                      className="mt-0.5 ml-4 w-[calc(100%-1rem)] border-b border-slate-400 bg-transparent text-[10px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                    />
                  ) : (
                    <div className="mt-0.5 ml-4 min-h-[14px] border-b border-slate-400 text-[10px] font-medium text-slate-900">
                      {customTests.bloodChemistryOthers || ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COL 3: ULTRASOUND & X-RAY */}
          <div className="col-span-3 flex flex-col justify-between rounded-md border border-slate-200 p-2">
            <div>
              <CategoryHeader title={ultrasoundCat.title} />
              <div className="space-y-0.5">
                {ultrasoundCat.items.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("ultrasound", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("ultrasound", item)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-2.5 border-t border-slate-200 pt-2">
              <CategoryHeader title={xrayCat.title} />
              <div className="space-y-0.5">
                {xrayCat.items.map((item) => (
                  <SlipCheckbox
                    key={item}
                    label={item}
                    checked={isSelected("xray", item)}
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("xray", item)}
                  />
                ))}

                {/* Others under X-Ray */}
                <div className="pt-1">
                  <SlipCheckbox
                    label="Others"
                    checked={
                      isSelected("xray", "Others") ||
                      Boolean(customTests.xrayOthers?.trim())
                    }
                    manual={isManual}
                    interactive={interactive}
                    onClick={() => onToggleTest?.("xray", "Others")}
                  />
                  {isManual ? (
                    <div className="mt-1 ml-4 h-3 border-b border-slate-400" />
                  ) : interactive ? (
                    <input
                      type="text"
                      value={customTests.xrayOthers || ""}
                      onChange={(e) =>
                        onCustomTestChange?.("xrayOthers", e.target.value)
                      }
                      placeholder="Specify..."
                      className="mt-0.5 ml-4 w-[calc(100%-1rem)] border-b border-slate-400 bg-transparent text-[10px] font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:placeholder:text-transparent"
                    />
                  ) : (
                    <div className="mt-0.5 ml-4 min-h-[14px] border-b border-slate-400 text-[10px] font-medium text-slate-900">
                      {customTests.xrayOthers || ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COL 4: 2D ECHO */}
          <div className="col-span-2 rounded-md border border-slate-200 p-2">
            <CategoryHeader title={echoCat.title} />
            <div className="space-y-0.5">
              {echoCat.items.map((item) => (
                <SlipCheckbox
                  key={item}
                  label={item}
                  checked={isSelected("twoDEcho", item)}
                  manual={isManual}
                  interactive={interactive}
                  onClick={() => onToggleTest?.("twoDEcho", item)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── OTHER EXAMINATIONS & PHYSICIAN FOOTER ─────────── */}
        <footer className="grid grid-cols-12 items-end gap-5 pt-1">
          <div className="col-span-7 space-y-2">
            <div className="rounded-md border border-slate-300 px-3 py-2">
              <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Specify Other Examination/s &amp; Clinical Notes
              </span>
              {isManual ? (
                <div className="mt-2 h-4 border-b border-dashed border-slate-400" />
              ) : interactive ? (
                <input
                  type="text"
                  value={otherExaminations}
                  onChange={(e) => onOtherExaminationsChange?.(e.target.value)}
                  placeholder="Write additional diagnostic tests or clinical indications..."
                  className="mt-1 w-full border-b border-slate-300 bg-transparent pb-0.5 text-xs font-medium text-slate-900 outline-none focus:border-[#1f3d38] print:border-b-slate-400 print:placeholder:text-transparent"
                />
              ) : (
                <div className="mt-1 min-h-[18px] border-b border-slate-300 text-xs font-medium text-slate-900">
                  {otherExaminations || ""}
                </div>
              )}
            </div>

            <p className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
              <span className="font-bold text-slate-800">Note:</span> Patient
              preparation (e.g. fasting) may be needed for some diagnostic
              procedures.
            </p>
          </div>

          <div className="col-span-5 text-right">
            <div className="inline-block w-full max-w-[240px] text-center">
              <p className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                Requesting Physician
              </p>

              <div className="relative mt-7 mb-1">
                {withSignature && signatureFilePath && (
                  <img
                    src={`${apiUrl}/${signatureFilePath}`}
                    alt="Physician Signature"
                    className="pointer-events-none absolute -top-8 left-1/2 h-12 max-w-36 -translate-x-1/2 object-contain"
                  />
                )}
                <div className="border-b border-slate-700 pb-0.5 text-xs font-bold text-slate-900">
                  {formattedDoctorName ? `${formattedDoctorName}, M.D.` : "_______________________, M.D."}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-2 text-[10px] text-slate-600">
                {doctor?.licenseNum && (
                  <span>PRC Lic. No.: {doctor.licenseNum}</span>
                )}
                {doctor?.licenseNum && clinicInfo?.phone && <span>&bull;</span>}
                {clinicInfo?.phone && <span>{clinicInfo.phone}</span>}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
