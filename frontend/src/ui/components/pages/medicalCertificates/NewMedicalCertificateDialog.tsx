import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Printer, Save, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import { Textarea } from "../../shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import { handleGetDoctors } from "@/services/apiAuth";
import { handleGetCases } from "@/services/apiCase";
import {
  parseLabResults,
  parsePhysicalExam,
  parseVitalSigns,
  useCreateMedicalCertificate,
  useUpdateMedicalCertificate,
} from "@/services/apiMedicalCertificates";
import { useAuth } from "@/hooks/useAuth";
import { formatUserName } from "@/lib/utils";
import type { IDoctor } from "@/types/User";
import type { ICase } from "@/types/CaseType";
import type {
  IMedCertLabResults,
  IMedCertPhysicalExam,
  IMedCertVitalSigns,
  IMedicalCertificate,
  MedicalCertificateTemplateType,
} from "@/types/MedicalCertificateType";
import {
  DEFAULT_PHYSICAL_EXAM,
  FITNESS_CLASS_OPTIONS,
  LAB_RESULT_LEFT_FIELDS,
  LAB_RESULT_RIGHT_FIELDS,
  MED_CERT_TEMPLATES,
  PHYSICAL_EXAM_FIELDS,
} from "./medicalCertificateCatalog";

interface NewMedicalCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  editingCertificate?: IMedicalCertificate | null;
}

export function NewMedicalCertificateDialog({
  open,
  onOpenChange,
  patientId,
  editingCertificate,
}: NewMedicalCertificateDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [templateType, setTemplateType] =
    useState<MedicalCertificateTemplateType>("GENERAL_CLEARANCE");
  const [doctorId, setDoctorId] = useState("");
  const [certificateDate, setCertificateDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [dateSeen, setDateSeen] = useState(dayjs().format("YYYY-MM-DD"));
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [vitalSigns, setVitalSigns] = useState<IMedCertVitalSigns>({});
  const [physicalExam, setPhysicalExam] = useState<IMedCertPhysicalExam>(
    DEFAULT_PHYSICAL_EXAM,
  );
  const [labResults, setLabResults] = useState<IMedCertLabResults>({});
  const [fitnessClass, setFitnessClass] = useState("CLASS_A");
  const [diagnosis, setDiagnosis] = useState("");
  const [remarks, setRemarks] = useState("");
  const [purpose, setPurpose] = useState("employment");

  const { data: doctors = [] } = useQuery<IDoctor[]>({
    queryFn: handleGetDoctors,
    queryKey: ["doctors"],
    enabled: open,
  });

  const { data: cases = [] } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
    enabled: open,
  });

  const { mutate: createCertificate, isPending: isCreating } =
    useCreateMedicalCertificate();
  const { mutate: updateCertificate, isPending: isUpdating } =
    useUpdateMedicalCertificate();

  useEffect(() => {
    if (!open) return;

    if (editingCertificate) {
      setTemplateType(editingCertificate.templateType);
      setDoctorId(editingCertificate.doctorId || "");
      setCertificateDate(
        dayjs(editingCertificate.certificateDate).format("YYYY-MM-DD"),
      );
      setDateSeen(
        editingCertificate.dateSeen
          ? dayjs(editingCertificate.dateSeen).format("YYYY-MM-DD")
          : dayjs(editingCertificate.certificateDate).format("YYYY-MM-DD"),
      );
      setReasonForVisit(editingCertificate.reasonForVisit || "");
      setVitalSigns(parseVitalSigns(editingCertificate.vitalSigns));
      setPhysicalExam({
        ...DEFAULT_PHYSICAL_EXAM,
        ...parsePhysicalExam(editingCertificate.physicalExam),
      });
      setLabResults(parseLabResults(editingCertificate.labResults));
      setFitnessClass(editingCertificate.fitnessClass || "");
      setDiagnosis(editingCertificate.diagnosis || "");
      setRemarks(editingCertificate.remarks || "");
      setPurpose(editingCertificate.purpose || "");
    } else {
      setTemplateType("GENERAL_CLEARANCE");
      setCertificateDate(dayjs().format("YYYY-MM-DD"));
      setDateSeen(dayjs().format("YYYY-MM-DD"));
      setReasonForVisit("");
      setVitalSigns({});
      setPhysicalExam(DEFAULT_PHYSICAL_EXAM);
      setLabResults({});
      setFitnessClass("CLASS_A");
      setDiagnosis("");
      setRemarks("");
      setPurpose("employment");

      if (user?.role === "DOCTOR") {
        setDoctorId(user.id);
      } else {
        const caseWithDoc = cases.find((c) => c.doctor?.id);
        if (caseWithDoc?.doctor?.id) {
          setDoctorId(caseWithDoc.doctor.id);
        } else if (doctors.length > 0) {
          setDoctorId(doctors[0].id);
        }
      }
    }
  }, [open, editingCertificate, user, cases, doctors]);

  const handleSubmit = (andPrint: boolean) => {
    const payloadCommon = {
      doctorId: doctorId || null,
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

    if (editingCertificate) {
      updateCertificate(
        { id: editingCertificate.id, ...payloadCommon },
        {
          onSuccess: (updated) => {
            onOpenChange(false);
            if (andPrint) {
              navigate(
                `/patients/${patientId}/medical-certificates/print?certificateId=${updated.id}&mode=digital`,
              );
            }
          },
        },
      );
    } else {
      createCertificate(
        { patientId, ...payloadCommon },
        {
          onSuccess: (created) => {
            onOpenChange(false);
            if (andPrint) {
              navigate(
                `/patients/${patientId}/medical-certificates/print?certificateId=${created.id}&mode=digital`,
              );
            }
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="text-base font-bold">
            {editingCertificate
              ? "Edit Medical Certificate"
              : "New Medical Certificate"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Choose one of the 3 certificate templates and fill in the clinical
            details, or print a blank certificate.
          </DialogDescription>
        </DialogHeader>

        {/* Template & Metadata */}
        <div className="space-y-3 border-b border-border/60 bg-muted/20 px-6 py-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {MED_CERT_TEMPLATES.map((tpl) => (
              <button
                key={tpl.value}
                type="button"
                onClick={() => setTemplateType(tpl.value)}
                className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                  templateType === tpl.value
                    ? "border-[#1f3d38] bg-[#1f3d38]/10 ring-1 ring-[#1f3d38]"
                    : "border-border/80 bg-card hover:bg-muted/50"
                }`}
              >
                <div className="text-xs font-bold text-foreground">
                  {tpl.shortLabel}
                </div>
                <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                  {tpl.description}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Attending / Examining Physician
              </Label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger className="h-8.5 text-xs">
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

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Certificate Date</Label>
              <Input
                type="date"
                value={certificateDate}
                onChange={(e) => setCertificateDate(e.target.value)}
                className="h-8.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Template Fields */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {templateType === "CONSULTATION_DIAGNOSIS" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Date Seen</Label>
                <Input
                  type="date"
                  value={dateSeen}
                  onChange={(e) => setDateSeen(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">
                  Reason for Visit / Chief Complaint
                </Label>
                <Input
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="e.g. fever and cough for 3 days"
                  className="h-8.5 text-xs"
                />
              </div>
            </div>
          )}

          {(templateType === "GENERAL_CLEARANCE" ||
            templateType === "PRE_EMPLOYMENT_PE") && (
            <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3">
              <Label className="text-xs font-bold uppercase text-primary">
                Vital Signs
              </Label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    Temp
                  </Label>
                  <Input
                    value={vitalSigns.temp || ""}
                    onChange={(e) =>
                      setVitalSigns((p) => ({ ...p, temp: e.target.value }))
                    }
                    placeholder="36.5 °C"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    Heart Rate
                  </Label>
                  <Input
                    value={vitalSigns.heartRate || ""}
                    onChange={(e) =>
                      setVitalSigns((p) => ({
                        ...p,
                        heartRate: e.target.value,
                      }))
                    }
                    placeholder="72 bpm"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    Resp. Rate
                  </Label>
                  <Input
                    value={vitalSigns.respiratoryRate || ""}
                    onChange={(e) =>
                      setVitalSigns((p) => ({
                        ...p,
                        respiratoryRate: e.target.value,
                      }))
                    }
                    placeholder="18 cpm"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    BP
                  </Label>
                  <Input
                    value={vitalSigns.bp || ""}
                    onChange={(e) =>
                      setVitalSigns((p) => ({ ...p, bp: e.target.value }))
                    }
                    placeholder="120/80 mmHg"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {templateType === "PRE_EMPLOYMENT_PE" && (
            <>
              <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3">
                <Label className="text-xs font-bold uppercase text-primary">
                  Physical Examination Findings
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {PHYSICAL_EXAM_FIELDS.map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        {label}
                      </Label>
                      <Input
                        value={physicalExam[key] ?? DEFAULT_PHYSICAL_EXAM[key]}
                        onChange={(e) =>
                          setPhysicalExam((p) => ({
                            ...p,
                            [key]: e.target.value,
                          }))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3">
                <Label className="text-xs font-bold uppercase text-primary">
                  Laboratory &amp; Diagnostic Results
                </Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[...LAB_RESULT_LEFT_FIELDS, ...LAB_RESULT_RIGHT_FIELDS].map(
                    ({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          {label}
                        </Label>
                        <Input
                          value={labResults[key] || ""}
                          onChange={(e) =>
                            setLabResults((p) => ({
                              ...p,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder="Normal / Result"
                          className="h-8 text-xs"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Fitness Classification
                </Label>
                <Select value={fitnessClass} onValueChange={setFitnessClass}>
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_CLASS_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        {opt.code} &ndash; {opt.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(templateType === "CONSULTATION_DIAGNOSIS" ||
            templateType === "PRE_EMPLOYMENT_PE") && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Diagnosis</Label>
              <Textarea
                rows={2}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
                className="text-xs"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              Remarks / Recommendations
            </Label>
            <Textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks or recommendations..."
              className="text-xs"
            />
          </div>

          {(templateType === "GENERAL_CLEARANCE" ||
            templateType === "PRE_EMPLOYMENT_PE") && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Purpose (Application for)
              </Label>
              <Input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="employment / school entrance / travel"
                className="h-8.5 text-xs"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-6 py-3 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              navigate(
                `/patients/${patientId}/medical-certificates/print?mode=manual&template=${templateType}`,
              );
            }}
            className="cursor-pointer gap-1.5 text-xs"
          >
            <Square className="size-3.5" />
            Print Blank Certificate
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCreating || isUpdating}
              onClick={() => handleSubmit(false)}
              className="cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Save className="size-3.5" />
              {editingCertificate ? "Update" : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isCreating || isUpdating}
              onClick={() => handleSubmit(true)}
              className="cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <Printer className="size-3.5" />
              {editingCertificate ? "Update & Print" : "Save & Print"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
