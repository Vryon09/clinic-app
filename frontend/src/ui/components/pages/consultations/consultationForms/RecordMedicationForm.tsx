// import type { IRecordForm } from "@/types/RecordType";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shadcn/card";
import { Button } from "../../../shadcn/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddedRecordMedicationList from "../recordMedication/AddedRecordMedicationList";
import type { IRecordMedicationForm } from "@/types/RecordMedicationsType";
import RecordMedicationDialog from "../recordMedication/RecordMedicationDialog";

function RecordMedicationForm({
  recordMedicationField,
  addMedication,
  deleteMedication,
  register,
  getValues,
  setValue,
  errors,
  setError,
  clearErrors,
}: IRecordMedicationForm) {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  return (
    <Card className="col-span-full rounded-xl border border-border/80 md:col-span-2">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Prescription Medications
            {recordMedicationField.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {recordMedicationField.length}
              </span>
            )}
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-lg text-xs"
            onClick={(e) => {
              e.preventDefault();
              setIsAdding((prev) => !prev);
            }}
          >
            {isAdding ? (
              "Adding…"
            ) : (
              <>
                <Plus className="size-3" />
                Add Medication
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <AddedRecordMedicationList
          recordMedicationField={recordMedicationField}
          deleteMedication={deleteMedication}
        />

        <RecordMedicationDialog
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          addMedication={addMedication}
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
        />
      </CardContent>
    </Card>
  );
}

export default RecordMedicationForm;
