import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import VitalSignsForm from "./VitalSignsForm";
import { Button } from "../../../shadcn/button";
import BackButton from "../../../BackButton";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAddRecord, useUpdateRecord } from "@/services/apiRecords";
import { useVisitDetailsForm } from "@/hooks/useVisitDetailsForm";
import { Skeleton } from "../../../shadcn/skeleton";
import RecordMedicationForm from "./RecordMedicationForm";
import VisitDetailsForm from "./VisitDetailsForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/shadcn/select";
import { handleGetCases, useAddCase } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CalendarDays, History, Plus, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCaseSchema, type AddCaseInput } from "@/schemas/caseSchema";
import { toast } from "sonner";
import CaseDialog from "./CaseDialog";
import dayjs from "dayjs";
import PatientHistoryDrawer from "./PatientHistoryDrawer";

function ConsultationsForm() {
  const [isAddingCase, setIsAddingCase] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const { user, isUserLoading } = useAuth();

  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: patient, isPending: isPatientLoading } = useQuery({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: cases, isPending: isCasesLoading } = useQuery<ICase[]>({
    queryFn: () => handleGetCases({ patientId }),
    queryKey: ["cases", patientId],
  });

  const location = useLocation();
  const formType = location.pathname.split("/").at(-1) as "edit" | "new";

  const { mutate: handleAddRecord } = useAddRecord();
  const { mutate: handleUpdateRecord } = useUpdateRecord();
  const { mutate: handleAddCase } = useAddCase(patientId);

  const navigate = useNavigate();

  const {
    register: caseRegister,
    control: caseControl,
    handleSubmit: caseHandleSubmit,
    reset: caseReset,
  } = useForm({
    resolver: zodResolver(addCaseSchema),
    defaultValues: {
      caseName: "",
      doctorId: "",
    },
  });

  function caseOnSubmit(caseData: AddCaseInput) {
    if (!patientId) {
      toast.error("patientId not found.", { position: "top-center" });
      return;
    }

    handleAddCase({
      caseName: caseData.caseName,
      doctorId: caseData.doctorId,
      patientId,
    });

    setIsAddingCase(false);
    caseReset();
  }

  const {
    handleSubmit: visitDetailsHandleSubmit,
    onSubmit: visitDetailsOnSubmit,
    isRecordLoading,
    register,
    recordMedicationField,
    addMedication,
    deleteMedication,
    getValues,
    setValue,
    errors,
    setError,
    control,
    onInvalidSubmit,
    clearErrors,
  } = useVisitDetailsForm({
    consultationId,
    patientId,
    formType,
    handleAddRecord,
    handleUpdateRecord,
    navigate,
    createdById: user!.id,
  });

  return (
    <div className="pb-10">
      <BackButton location={`/patients/${patientId}`} />

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {formType === "edit" ? "Edit Consultation" : "New Consultation Encounter"}
            </h1>
            <span className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
              Clinical Note
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              {isPatientLoading ? (
                <Skeleton className="h-4 w-32 rounded" />
              ) : (
                <span className="font-semibold text-foreground">
                  {`${patient?.lastName || ""}, ${patient?.firstName || ""}${patient?.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}
                </span>
              )}
            </span>

            {patient?.sex && (
              <span className="inline-flex items-center rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {patient.sex === "MALE" ? "Male" : "Female"}
                {patient.dateOfBirth && ` · ${dayjs().diff(dayjs(patient.dateOfBirth), "year")}y`}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              <span>{dayjs().format("MMMM DD, YYYY")}</span>
            </span>
          </div>
        </div>

        {/* Header Actions: History Drawer + Case selector & New Case Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="h-9 gap-1.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer hover:bg-muted"
            onClick={() => setIsHistoryOpen(true)}
            title="View past patient consultations, vitals, and prescriptions"
          >
            <History className="size-3.5 text-primary" />
            <span>Past Encounters</span>
            {cases && cases.reduce((acc, c) => acc + (c.records?.length || 0), 0) > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary">
                {cases.reduce((acc, c) => acc + (c.records?.length || 0), 0)}
              </span>
            )}
          </Button>

          <Controller
            name="caseId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isCasesLoading}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-9 w-full min-w-44 max-w-56 cursor-pointer rounded-lg border-border/80 text-xs sm:w-52">
                  <SelectValue placeholder="Assign medical case..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-[11px]">Active Cases</SelectLabel>
                    {cases?.map((caseItem) => (
                      <SelectItem
                        key={caseItem.id}
                        value={caseItem.id}
                        className="cursor-pointer text-xs"
                      >
                        {caseItem.caseName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Button
            size="sm"
            type="button"
            variant="outline"
            className="h-9 gap-1.5 rounded-lg border-border/80 text-xs font-medium cursor-pointer"
            onClick={() => setIsAddingCase(true)}
            title="Create a new medical case"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">New Case</span>
          </Button>

          <CaseDialog
            caseControl={caseControl}
            caseHandleSubmit={caseHandleSubmit}
            caseOnSubmit={caseOnSubmit}
            caseRegister={caseRegister}
            isAddingCase={isAddingCase}
            setIsAddingCase={setIsAddingCase}
            action="add"
          />
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={visitDetailsHandleSubmit(
          visitDetailsOnSubmit,
          onInvalidSubmit,
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <VisitDetailsForm
            register={register}
            setValue={setValue}
            getValues={getValues}
          />
          <VitalSignsForm register={register} errors={errors} control={control} />
          <RecordMedicationForm
            recordMedicationField={recordMedicationField}
            addMedication={addMedication}
            deleteMedication={deleteMedication}
            register={register}
            getValues={getValues}
            setValue={setValue}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
          />
        </div>

      {/* Patient Encounter History Slide-Over Drawer */}
      <PatientHistoryDrawer
        cases={cases}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        onInsertDiagnosis={(diag) => {
          setValue("diagnosis", diag, { shouldDirty: true, shouldValidate: true });
        }}
        onInsertMedication={(med) => {
          addMedication(med);
        }}
      />

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border/60 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/patients/${patientId}`);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="rounded-lg"
            disabled={isRecordLoading || isUserLoading}
          >
            Complete Consultation
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationsForm;
