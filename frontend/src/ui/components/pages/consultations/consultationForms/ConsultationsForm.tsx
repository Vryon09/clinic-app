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

function ConsultationsForm() {
  const [caseName, setCaseName] = useState<string>("");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");

  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  console.log(selectedCaseId);

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
  } = useVisitDetailsForm({
    consultationId,
    patientId,
    formType,
    handleAddRecord,
    handleUpdateRecord,
    navigate,
    caseId: selectedCaseId,
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

        <div>
          <Select
            disabled={isCasesLoading}
            value={selectedCaseId}
            onValueChange={(value) => setSelectedCaseId(value)}
          >
            <SelectTrigger className="w-full max-w-48 cursor-pointer">
              <SelectValue placeholder="Select a case" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cases</SelectLabel>
                <div className="my-1 flex gap-2 px-1">
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
                </div>
                {cases?.map((caseItem) => (
                  <SelectItem
                    key={caseItem.id}
                    value={caseItem.id}
                    className="cursor-pointer capitalize"
                  >
                    {caseItem.caseName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={visitDetailsHandleSubmit(visitDetailsOnSubmit)}>
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
          <Button disabled={isRecordLoading}>Complete Consultation</Button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationsForm;
