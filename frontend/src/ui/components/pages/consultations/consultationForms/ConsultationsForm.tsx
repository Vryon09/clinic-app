import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import VitalSignsForm from "./VitalSignsForm";
import { Button } from "../../../shadcn/button";
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
import { CalendarDays, Plus, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCaseSchema, type AddCaseInput } from "@/schemas/caseSchema";
import { toast } from "sonner";
import CaseDialog from "./CaseDialog";
import dayjs from "dayjs";

function ConsultationsForm() {
  const [isAddingCase, setIsAddingCase] = useState<boolean>(false);

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
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {formType === "edit" ? "Edit Consultation" : "New Consultation"}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {isPatientLoading ? (
                <Skeleton className="h-4 w-32 rounded" />
              ) : (
                <span className="font-medium text-foreground">
                  {`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}
                </span>
              )}
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              <span>{dayjs().format("MMMM DD, YYYY")}</span>
            </span>
          </div>
        </div>

        {/* Case selector */}
        <Controller
          name="caseId"
          control={control}
          render={({ field }) => (
            <Select
              disabled={isCasesLoading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="h-9 w-full max-w-52 cursor-pointer rounded-lg border-border/80 text-sm sm:w-52">
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[11px]">Cases</SelectLabel>
                  <div className="my-1.5 px-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-full gap-1.5 rounded-lg text-xs"
                      onClick={() => setIsAddingCase(true)}
                    >
                      {isAddingCase ? (
                        "Opening…"
                      ) : (
                        <>
                          <Plus className="size-3" /> Add New Case
                        </>
                      )}
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
                  {cases?.map((caseItem) => (
                    <SelectItem
                      key={caseItem.id}
                      value={caseItem.id}
                      className="cursor-pointer"
                    >
                      {caseItem.caseName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Form body */}
      <form
        onSubmit={visitDetailsHandleSubmit(
          visitDetailsOnSubmit,
          onInvalidSubmit,
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <VisitDetailsForm register={register} />
          <VitalSignsForm register={register} errors={errors} />
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
