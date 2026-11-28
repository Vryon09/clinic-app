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
import { handleGetClinicInfo, useUploadClinicLogo } from "@/services/apiClinicInfo";
import { handleGetPatient } from "@/services/apiPatients";
import { handleGetDoctors } from "@/services/apiAuth";
import { handleGetCases } from "@/services/apiCase";
import { handleGetSignature } from "@/services/apiSignature";
import {
  parseCustomTests,
  parseSelectedTests,
  useCreateLabRequest,
  useLabRequest,
  useUpdateLabRequest,
} from "@/services/apiLabRequests";
import { useAuth } from "@/hooks/useAuth";
import { useAccess } from "@/hooks/useAccess";
import { formatUserName } from "@/lib/utils";
import type { IClinicInfo } from "@/types/ClinicInfo";
import type { IPatient } from "@/types/PatientType";
import type { IDoctor } from "@/types/User";
import type { ICase } from "@/types/CaseType";
import type {
  ILabRequestCustomTests,
  ILabRequestSelectedTests,
  LabRequestCategoryKey,
} from "@/types/LabRequestType";
import { LabRequestSlipDocument } from "./LabRequestSlipDocument";

export default function LabRequestPrintView() {
  const { patientId } = useParams() as { patientId: string };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requestId = searchParams.get("requestId");
  const initialMode =
    searchParams.get("mode") === "manual" ? "manual" : "digital";

  const [mode, setMode] = useState<"digital" | "manual">(initialMode);
  const [withLogo, setWithLogo] = useState<boolean>(true);
  const [logoPosition, setLogoPosition] = useState<"left" | "center" | "right">(
    "left",
  );
  const [withSignature, setWithSignature] = useState<boolean>(true);
  const [requestDate, setRequestDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedTests, setSelectedTests] = useState<ILabRequestSelectedTests>(
    {},
  );
  const [customTests, setCustomTests] = useState<ILabRequestCustomTests>({});
  const [otherExaminations, setOtherExaminations] = useState<string>("");
  const [hydratedRequestId, setHydratedRequestId] = useState<string | null>(
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

  const { isHidden } = useAccess();

  const { data: cases = [] } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
    enabled: !isHidden("patients.consultations"),
  });

  const { data: existingRequest } = useLabRequest(requestId);
  const { mutate: createLabRequest, isPending: isCreating } =
    useCreateLabRequest();
  const { mutate: updateLabRequest, isPending: isUpdating } =
    useUpdateLabRequest();
  const { mutate: uploadLogo, isPending: isUploadingLogo } =
    useUploadClinicLogo();

  // Hydrate state from loaded saved request
  useEffect(() => {
    if (existingRequest && existingRequest.id !== hydratedRequestId) {
      setSelectedTests(parseSelectedTests(existingRequest.selectedTests));
      setCustomTests(parseCustomTests(existingRequest.customTests));
      setOtherExaminations(existingRequest.otherExaminations || "");
      setRequestDate(dayjs(existingRequest.requestDate).format("YYYY-MM-DD"));
      if (existingRequest.doctorId) {
        setSelectedDoctorId(existingRequest.doctorId);
      }
      setHydratedRequestId(existingRequest.id);
    }
  }, [existingRequest, hydratedRequestId]);

  // Default doctor selection when not loaded from existing request
  useEffect(() => {
    if (selectedDoctorId || (requestId && existingRequest?.doctorId)) return;

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
  }, [selectedDoctorId, requestId, existingRequest, user, cases, doctors]);

  const activeDoctor = useMemo(() => {
    if (existingRequest?.doctor && existingRequest.doctor.id === selectedDoctorId) {
      return existingRequest.doctor;
    }
    return doctors.find((d) => d.id === selectedDoctorId) || null;
  }, [doctors, selectedDoctorId, existingRequest]);

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

  const handleToggleTest = (
    category: LabRequestCategoryKey,
    testName: string,
  ) => {
    setSelectedTests((prev) => {
      const current = prev[category] || [];
      const exists = current.includes(testName);
      const updated = exists
        ? current.filter((item) => item !== testName)
        : [...current, testName];
      return {
        ...prev,
        [category]: updated,
      };
    });
  };

  const handleCustomTestChange = (
    key: keyof ILabRequestCustomTests,
    value: string,
  ) => {
    setCustomTests((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = (shouldPrintAfter = false) => {
    if (requestId) {
      updateLabRequest(
        {
          id: requestId,
          doctorId: selectedDoctorId || null,
          requestDate: new Date(requestDate).toISOString(),
          selectedTests,
          customTests,
          otherExaminations,
        },
        {
          onSuccess: () => {
            if (shouldPrintAfter) {
              setTimeout(() => window.print(), 100);
            }
          },
        },
      );
    } else {
      createLabRequest(
        {
          patientId,
          doctorId: selectedDoctorId || null,
          requestDate: new Date(requestDate).toISOString(),
          selectedTests,
          customTests,
          otherExaminations,
        },
        {
          onSuccess: (created) => {
            const next = new URLSearchParams(searchParams);
            next.set("requestId", created.id);
            next.set("mode", mode);
            setSearchParams(next, { replace: true });
            setHydratedRequestId(created.id);
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

  const totalSelectedCount = useMemo(() => {
    const testCount = Object.values(selectedTests).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0,
    );
    const customCount =
      (customTests.bloodChemistryOthers?.trim() ? 1 : 0) +
      (customTests.xrayOthers?.trim() ? 1 : 0) +
      (otherExaminations.trim() ? 1 : 0);
    return testCount + customCount;
  }, [selectedTests, customTests, otherExaminations]);

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
                Laboratory Request Slip
              </h1>
              <p className="text-xs text-muted-foreground">
                {patientName} &middot;{" "}
                {mode === "digital"
                  ? `Digital mode (${totalSelectedCount} selected — click boxes directly on slip to toggle)`
                  : "Manual blank mode (empty checkboxes for pen & paper)"}
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
                {requestId ? "Update Request" : "Save Request"}
              </Button>
            )}
            <Button
              size="sm"
              disabled={isClinicInfoPending || isPatientPending}
              onClick={() => window.print()}
              className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              Print Lab Request
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
                        contextLabel: "Lab Request Print View",
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
                      contextLabel: "Lab Request Print View",
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          {/* Mode + Credentials */}
          <div className="flex flex-wrap items-center gap-2.5">
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
                Digital Check
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
                <SelectTrigger className="h-8 w-48 text-xs">
                  <SelectValue placeholder="Select physician" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id} className="text-xs">
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
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
              />
            </div>
          </div>

          {/* Logo Customization Controls (Matching ConsultationPrintView) */}
          <div className="flex flex-wrap items-center gap-2.5">
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
                      contextLabel: "Lab Request Print View",
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

      {/* ── PRINTABLE REFERRAL SLIP ───────────────────────────── */}
      <LabRequestSlipDocument
        clinicInfo={clinicInfo}
        patient={patient}
        doctor={activeDoctor}
        signatureFilePath={signatureData?.filePath}
        requestDate={requestDate}
        mode={mode}
        selectedTests={selectedTests}
        customTests={customTests}
        otherExaminations={otherExaminations}
        withLogo={withLogo}
        logoPosition={logoPosition}
        withSignature={withSignature}
        interactive={mode === "digital"}
        onToggleTest={handleToggleTest}
        onCustomTestChange={handleCustomTestChange}
        onOtherExaminationsChange={setOtherExaminations}
      />

      {/* Bottom quick save/print action for convenience */}
      <div className="mx-auto flex max-w-[210mm] items-center justify-between pt-2 print:hidden">
        <div className="text-xs text-muted-foreground">
          {mode === "digital" && totalSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedTests({});
                setCustomTests({});
                setOtherExaminations("");
              }}
              className="cursor-pointer underline hover:text-foreground"
            >
              Clear all checked items
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mode === "digital" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isCreating || isUpdating}
              onClick={() => handleSave(true)}
              className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
            >
              <FilePlus2 className="size-3.5" />
              {requestId ? "Update & Print" : "Save & Print"}
            </Button>
          )}
          <Button
            size="sm"
            disabled={isClinicInfoPending || isPatientPending}
            onClick={() => window.print()}
            className="cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <Printer className="size-3.5" />
            Print Slip
          </Button>
        </div>
      </div>
    </div>
  );
}
