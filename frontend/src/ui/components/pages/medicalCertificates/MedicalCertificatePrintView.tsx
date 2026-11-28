import { useEffect, useMemo, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckSquare,
  FilePlus2,
  ImagePlus,
  Printer,
  RefreshCw,
  Save,
  Settings,
  Square,
} from "lucide-react";
import { Button } from "../../shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import BackButton from "../../BackButton";
import {
  handleGetClinicInfo,
  useUploadClinicLogo,
} from "@/services/apiClinicInfo";
import { handleGetPatient } from "@/services/apiPatients";
import { handleGetDoctors } from "@/services/apiAuth";
import { handleGetCases } from "@/services/apiCase";
import { handleGetSignature } from "@/services/apiSignature";
import {
  parseLabResults,
  parsePhysicalExam,
  parseVitalSigns,
  useCreateMedicalCertificate,
  useMedicalCertificate,
  useUpdateMedicalCertificate,
} from "@/services/apiMedicalCertificates";
import { useAuth } from "@/hooks/useAuth";
import { formatUserName } from "@/lib/utils";
import type { IClinicInfo } from "@/types/ClinicInfo";
import type { IPatient } from "@/types/PatientType";
import type { IDoctor } from "@/types/User";
import type { ICase } from "@/types/CaseType";
import type {
  IMedCertLabResults,
  IMedCertPhysicalExam,
  IMedCertVitalSigns,
  MedicalCertificateTemplateType,
} from "@/types/MedicalCertificateType";
import {
  DEFAULT_PHYSICAL_EXAM,
  MED_CERT_TEMPLATES,
} from "./medicalCertificateCatalog";
import { MedicalCertificateDocument } from "./MedicalCertificateDocument";

export default function MedicalCertificatePrintView() {
  const { patientId } = useParams() as { patientId: string };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const certificateId = searchParams.get("certificateId");
  const initialMode =
    searchParams.get("mode") === "manual" ? "manual" : "digital";
  const initialTemplate =
    (searchParams.get("template") as MedicalCertificateTemplateType) ||
    "GENERAL_CLEARANCE";

  const [mode, setMode] = useState<"digital" | "manual">(initialMode);
  const [templateType, setTemplateType] =
    useState<MedicalCertificateTemplateType>(initialTemplate);
  const [withLogo, setWithLogo] = useState<boolean>(true);
  const [logoPosition, setLogoPosition] = useState<"left" | "center" | "right">(
    "left",
  );
  const [withSignature, setWithSignature] = useState<boolean>(true);
  const [certificateDate, setCertificateDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  const [dateSeen, setDateSeen] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [vitalSigns, setVitalSigns] = useState<IMedCertVitalSigns>({});
  const [physicalExam, setPhysicalExam] = useState<IMedCertPhysicalExam>(
    DEFAULT_PHYSICAL_EXAM,
  );
  const [labResults, setLabResults] = useState<IMedCertLabResults>({});
  const [fitnessClass, setFitnessClass] = useState<string>("CLASS_A");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("employment");

  const [hydratedId, setHydratedId] = useState<string | null>(null);
  const [autoFilledPatientId, setAutoFilledPatientId] = useState<string | null>(
    null,
  );

  const { user } = useAuth();

  const { data: clinicInfo, isPending: isClinicInfoPending } =
    useQuery<IClinicInfo>({
      queryFn: handleGetClinicInfo,
      queryKey: ["clinicInfo"],
    });

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: doctors = [] } = useQuery<IDoctor[]>({
    queryFn: handleGetDoctors,
    queryKey: ["doctors"],
  });

  const { data: cases = [] } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
  });

  const { data: existingCertificate } = useMedicalCertificate(certificateId);
  const { mutate: createCertificate, isPending: isCreating } =
    useCreateMedicalCertificate();
  const { mutate: updateCertificate, isPending: isUpdating } =
    useUpdateMedicalCertificate();
  const { mutate: uploadLogo, isPending: isUploadingLogo } =
    useUploadClinicLogo();

  // Hydrate from saved medical certificate
  useEffect(() => {
    if (existingCertificate && existingCertificate.id !== hydratedId) {
      setTemplateType(existingCertificate.templateType);
      setCertificateDate(
        dayjs(existingCertificate.certificateDate).format("YYYY-MM-DD"),
      );
      if (existingCertificate.doctorId) {
        setSelectedDoctorId(existingCertificate.doctorId);
      }
      setDateSeen(
        existingCertificate.dateSeen
          ? dayjs(existingCertificate.dateSeen).format("YYYY-MM-DD")
          : dayjs(existingCertificate.certificateDate).format("YYYY-MM-DD"),
      );
      setReasonForVisit(existingCertificate.reasonForVisit || "");
      setVitalSigns(parseVitalSigns(existingCertificate.vitalSigns));
      const parsedPe = parsePhysicalExam(existingCertificate.physicalExam);
      setPhysicalExam({ ...DEFAULT_PHYSICAL_EXAM, ...parsedPe });
      setLabResults(parseLabResults(existingCertificate.labResults));
      setFitnessClass(existingCertificate.fitnessClass || "");
      setDiagnosis(existingCertificate.diagnosis || "");
      setRemarks(existingCertificate.remarks || "");
      setPurpose(existingCertificate.purpose || "");
      setHydratedId(existingCertificate.id);
    }
  }, [existingCertificate, hydratedId]);

  // Auto-fill latest vital signs & diagnosis from patient's latest record on new certificate
  useEffect(() => {
    if (certificateId || !patient || autoFilledPatientId === patient.id) return;
    const latestRecord = patient.records?.[0];
    if (latestRecord) {
      const vs = latestRecord.vitalSigns;
      if (vs) {
        const bp =
          vs.bloodPressureSystolic && vs.bloodPressureDiastolic
            ? `${vs.bloodPressureSystolic}/${vs.bloodPressureDiastolic} mmHg`
            : "";
        setVitalSigns({
          temp: vs.temperature ? `${vs.temperature} °C` : "",
          bp,
        });
      }
      if (latestRecord.diagnosis) {
        setDiagnosis(latestRecord.diagnosis);
      }
      if (latestRecord.symptoms) {
        setReasonForVisit(latestRecord.symptoms);
      }
      if (latestRecord.visitDate) {
        setDateSeen(dayjs(latestRecord.visitDate).format("YYYY-MM-DD"));
      }
    }
    setAutoFilledPatientId(patient.id);
  }, [certificateId, patient, autoFilledPatientId]);

  // Default doctor selection
  useEffect(() => {
    if (selectedDoctorId || (certificateId && existingCertificate?.doctorId))
      return;

    if (user?.role === "DOCTOR") {
      setSelectedDoctorId(user.id);
      return;
    }

    const caseWithDoctor = cases.find((c) => c.doctor?.id);
    if (caseWithDoctor?.doctor?.id) {
      setSelectedDoctorId(caseWithDoctor.doctor.id);
      return;
    }

    if (doctors.length > 0) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [selectedDoctorId, certificateId, existingCertificate, user, cases, doctors]);

  const activeDoctor = useMemo(() => {
    if (
      existingCertificate?.doctor &&
      existingCertificate.doctor.id === selectedDoctorId
    ) {
      return existingCertificate.doctor;
    }
    return doctors.find((d) => d.id === selectedDoctorId) || null;
  }, [doctors, selectedDoctorId, existingCertificate]);

  const { data: signatureData, isPending: isSignaturePending } = useQuery({
    queryKey: ["signature", selectedDoctorId],
    queryFn: () => {
      if (!selectedDoctorId) throw new Error("Doctor ID is required");
      return handleGetSignature(selectedDoctorId);
    },
    retry: false,
    enabled: !!selectedDoctorId,
  });

  const logoUrl = clinicInfo?.logoPath
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${clinicInfo.logoPath}`
    : null;

  const handleSave = (shouldPrintAfter = false) => {
    const payloadCommon = {
      doctorId: selectedDoctorId || null,
      templateType,
      certificateDate: new Date(certificateDate).toISOString(),
      dateSeen: dateSeen ? new Date(dateSeen).toISOString() : null,
      reasonForVisit: reasonForVisit || null,
      vitalSigns,
      physicalExam,
      labResults,
      fitnessClass: fitnessClass || null,
      diagnosis: diagnosis || null,
      remarks: remarks || null,
      purpose: purpose || null,
    };

    if (certificateId) {
      updateCertificate(
        { id: certificateId, ...payloadCommon },
        {
          onSuccess: () => {
            if (shouldPrintAfter) {
              setTimeout(() => window.print(), 100);
            }
          },
        },
      );
    } else {
      createCertificate(
        { patientId, ...payloadCommon },
        {
          onSuccess: (created) => {
            const next = new URLSearchParams(searchParams);
            next.set("certificateId", created.id);
            next.set("mode", mode);
            setSearchParams(next, { replace: true });
            setHydratedId(created.id);
            if (shouldPrintAfter) {
              setTimeout(() => window.print(), 150);
            }
          },
        },
      );
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.warning("Invalid Image Type", {
        description:
          "Please select a valid image file (.png, .jpg, .webp, .svg).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("File Size Exceeded", {
        description: "Clinic logo image size must be less than 5MB.",
      });
      return;
    }

    uploadLogo(file, {
      onSuccess: () => {
        setWithLogo(true);
      },
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`.trim()
    : "Patient";

  return (
    <div className="space-y-4 pb-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleLogoFileChange}
      />

      {/* ── TOP NAVIGATION & PRINT CONTROLS (hidden when printing) ── */}
      <div className="mx-auto max-w-[210mm] space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackButton
              location={`/patients/${patientId}`}
              className="mb-0"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Medical Certificate
              </h1>
              <p className="text-xs text-muted-foreground">
                {patientName} &middot;{" "}
                {mode === "digital"
                  ? "Digital mode (click underlined fields on the certificate to edit)"
                  : "Manual blank mode (empty lines & checkboxes for pen & paper)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === "digital" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isCreating || isUpdating}
                onClick={() => handleSave(false)}
                className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
              >
                <Save className="size-3.5" />
                {certificateId ? "Update Certificate" : "Save Certificate"}
              </Button>
            )}
            <Button
              size="sm"
              disabled={isClinicInfoPending || isPatientPending}
              onClick={() => window.print()}
              className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              Print Certificate
            </Button>
          </div>
        </div>

        {/* Warnings */}
        {withSignature &&
          selectedDoctorId &&
          !isSignaturePending &&
          !signatureData && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                Selected doctor has no uploaded signature yet. Manage signature
                in{" "}
                <span
                  className="cursor-pointer font-semibold underline hover:text-amber-950"
                  onClick={() =>
                    navigate("/settings", {
                      state: {
                        returnUrl: `${location.pathname}${location.search}`,
                        patientName,
                        contextLabel: "Medical Certificate Print View",
                      },
                    })
                  }
                >
                  Settings
                </span>
                .
              </span>
            </div>
          )}

        {activeDoctor && !activeDoctor.licenseNum && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Doctor license number is not set. You can add it in{" "}
              <span
                className="cursor-pointer font-semibold underline hover:text-amber-950"
                onClick={() =>
                  navigate("/settings", {
                    state: {
                      returnUrl: `${location.pathname}${location.search}`,
                      patientName,
                      contextLabel: "Medical Certificate Print View",
                    },
                  })
                }
              >
                Settings &gt; Accounts
              </span>
              .
            </span>
          </div>
        )}

        {/* Controls Bar */}
        <div className="space-y-2.5 rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          {/* Template Selector Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-semibold text-muted-foreground">
                Template:
              </span>
              {MED_CERT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.value}
                  type="button"
                  onClick={() => setTemplateType(tpl.value)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    templateType === tpl.value
                      ? "bg-[#1f3d38] text-white shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tpl.shortLabel}
                </button>
              ))}
            </div>

            {/* Digital vs Manual Mode Toggle */}
            <div className="inline-flex items-center overflow-hidden rounded-full bg-zinc-900 p-1 select-none">
              <button
                type="button"
                onClick={() => setMode("digital")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  mode === "digital"
                    ? "bg-white font-semibold text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <CheckSquare className="size-3.5" />
                Digital
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  mode === "manual"
                    ? "bg-white font-semibold text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Square className="size-3.5" />
                Manual (Blank)
              </button>
            </div>
          </div>

          {/* Credentials & Logo Controls Row (Copied from LabRequestPrintView) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Signature Toggle */}
              <div className="inline-flex items-center overflow-hidden rounded-full bg-zinc-900 p-1 select-none">
                <button
                  type="button"
                  onClick={() => setWithSignature(true)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
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
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    !withSignature
                      ? "bg-white font-semibold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Without Signature
                </button>
              </div>

              {/* Doctor Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Physician:
                </span>
                <Select
                  value={selectedDoctorId}
                  onValueChange={setSelectedDoctorId}
                >
                  <SelectTrigger className="h-8 w-44 text-xs">
                    <SelectValue placeholder="Select physician" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem
                        key={doc.id}
                        value={doc.id}
                        className="text-xs"
                      >
                        {formatUserName(doc, {
                          includeMiddle: true,
                          useMiddleInitial: true,
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Date:
                </span>
                <input
                  type="date"
                  value={certificateDate}
                  onChange={(e) => setCertificateDate(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                />
              </div>
            </div>

            {/* Logo Customization Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center overflow-hidden rounded-full bg-zinc-900 p-1 select-none">
                <button
                  type="button"
                  onClick={() => setWithLogo(true)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    withLogo
                      ? "bg-white font-semibold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  With Logo
                </button>
                <button
                  type="button"
                  onClick={() => setWithLogo(false)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    !withLogo
                      ? "bg-white font-semibold text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Without Logo
                </button>
              </div>

              {withLogo && logoUrl && (
                <div className="inline-flex items-center overflow-hidden rounded-full bg-zinc-900 p-1 select-none">
                  <span className="px-2 text-[11px] font-medium text-zinc-400">
                    Position:
                  </span>
                  {(["left", "center", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setLogoPosition(pos)}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-all duration-200 ${
                        logoPosition === pos
                          ? "bg-white font-semibold text-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingLogo}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 cursor-pointer gap-1.5 rounded-full text-xs font-medium"
              >
                {isUploadingLogo ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : logoUrl ? (
                  <RefreshCw className="size-3.5" />
                ) : (
                  <ImagePlus className="size-3.5" />
                )}
                {logoUrl ? "Change Logo" : "Add Logo"}
              </Button>

              {withLogo && !logoUrl && (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/settings", {
                      state: {
                        returnUrl: `${location.pathname}${location.search}`,
                        patientName,
                        contextLabel: "Medical Certificate Print View",
                      },
                    })
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20"
                >
                  <Settings className="size-3" />
                  <span>Clinic Settings</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRINTABLE MEDICAL CERTIFICATE ─────────────────────── */}
      <MedicalCertificateDocument
        clinicInfo={clinicInfo}
        patient={patient}
        doctor={activeDoctor}
        signatureFilePath={signatureData?.filePath}
        templateType={templateType}
        certificateDate={certificateDate}
        mode={mode}
        dateSeen={dateSeen}
        reasonForVisit={reasonForVisit}
        vitalSigns={vitalSigns}
        physicalExam={physicalExam}
        labResults={labResults}
        fitnessClass={fitnessClass}
        diagnosis={diagnosis}
        remarks={remarks}
        purpose={purpose}
        withLogo={withLogo}
        logoPosition={logoPosition}
        withSignature={withSignature}
        interactive={mode === "digital"}
        onDateSeenChange={setDateSeen}
        onReasonForVisitChange={setReasonForVisit}
        onVitalSignChange={(key, val) =>
          setVitalSigns((prev) => ({ ...prev, [key]: val }))
        }
        onPhysicalExamChange={(key, val) =>
          setPhysicalExam((prev) => ({ ...prev, [key]: val }))
        }
        onLabResultChange={(key, val) =>
          setLabResults((prev) => ({ ...prev, [key]: val }))
        }
        onFitnessClassChange={setFitnessClass}
        onDiagnosisChange={setDiagnosis}
        onRemarksChange={setRemarks}
        onPurposeChange={setPurpose}
      />

      {/* Bottom quick save & print bar */}
      <div className="mx-auto flex max-w-[210mm] items-center justify-end gap-2 pt-2 print:hidden">
        {mode === "digital" && (
          <Button
            variant="outline"
            size="sm"
            disabled={isCreating || isUpdating}
            onClick={() => handleSave(true)}
            className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <FilePlus2 className="size-3.5" />
            {certificateId ? "Update & Print" : "Save & Print"}
          </Button>
        )}
        <Button
          size="sm"
          disabled={isClinicInfoPending || isPatientPending}
          onClick={() => window.print()}
          className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
        >
          <Printer className="size-3.5" />
          Print Certificate
        </Button>
      </div>
    </div>
  );
}
