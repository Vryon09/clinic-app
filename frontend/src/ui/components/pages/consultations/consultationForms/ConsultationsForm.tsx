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
import { Input } from "@/ui/components/shadcn/input";
import { handleGetCases, useAddCase } from "@/services/apiCase";
import type { ICase } from "@/types/CaseType";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/ui/components/shadcn/field";
import { handleGetDoctors } from "@/services/apiAuth";
import type { IDoctor } from "@/types/User";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCaseSchema, type AddCaseInput } from "@/schemas/caseSchema";
import { toast } from "sonner";

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

  const { data: doctors, isPending: isDoctorsLoading } = useQuery<IDoctor[]>({
    queryFn: handleGetDoctors,
    queryKey: ["doctors"],
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
    <div className="pb-8">
      <div className="flex justify-between">
        <div className="mb-4 space-y-1">
          <p className="text-2xl font-semibold">New Consultation</p>
          <p>
            Patient:{" "}
            {isPatientLoading ? (
              <Skeleton className="h-4 w-24 bg-neutral-300" />
            ) : (
              <span className="font-semibold">
                {" "}
                {`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}
              </span>
            )}
          </p>
        </div>

        <Controller
          name="caseId"
          control={control}
          render={({ field }) => (
            <Select
              disabled={isCasesLoading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full max-w-48 cursor-pointer">
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cases</SelectLabel>
                  <div className="my-2 flex justify-end px-1">
                    <Button
                      size="xs"
                      className="w-full text-xs"
                      onClick={() => setIsAddingCase(true)}
                    >
                      {isAddingCase ? (
                        "Adding..."
                      ) : (
                        <>
                          <Plus /> Add New Case
                        </>
                      )}
                    </Button>

                    <Dialog open={isAddingCase} onOpenChange={setIsAddingCase}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Case</DialogTitle>
                        </DialogHeader>

                        <form
                          onSubmit={caseHandleSubmit(caseOnSubmit, (errors) =>
                            console.log(errors),
                          )}
                        >
                          <FieldGroup>
                            <Field>
                              <FieldLabel>Case Name</FieldLabel>
                              <Input
                                type="text"
                                {...caseRegister("caseName")}
                              />
                            </Field>

                            <Field>
                              <FieldLabel>Doctor</FieldLabel>

                              <Controller
                                name="doctorId"
                                control={caseControl}
                                render={({ field }) => (
                                  <Select
                                    disabled={isDoctorsLoading}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full cursor-pointer">
                                      <SelectValue placeholder="Select a doctor" />
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        {doctors?.map((doctor) => (
                                          <SelectItem
                                            key={doctor.id}
                                            value={doctor.id}
                                            className="cursor-pointer"
                                          >
                                            {doctor.username}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </Field>

                            <div className="mt-4 flex justify-end">
                              <Button type="submit">Add</Button>
                            </div>
                          </FieldGroup>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {/* <div className="my-1 flex gap-2 px-1">
                    <Input
                      type="text"
                      value={caseName}
                      onChange={(e) => setCaseName(e.target.value)}
                    />
                    <Button
                      onClick={() => handleAddCase({ patientId, caseName })}
                    >
                      Add
                    </Button>
                  </div> */}
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

      <form
        onSubmit={visitDetailsHandleSubmit(
          visitDetailsOnSubmit,
          onInvalidSubmit,
        )}
      >
        <div className="grid w-full grid-cols-2 gap-4">
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
          />
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/patients/${patientId}`);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isRecordLoading || isUserLoading}>
            Complete Consultation
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationsForm;
