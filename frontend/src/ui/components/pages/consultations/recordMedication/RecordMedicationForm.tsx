// import type { IRecordForm } from "@/types/RecordType";
import { Card } from "../../../shadcn/card";
import { Button } from "../../../shadcn/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddedRecordMedicationList from "./AddedRecordMedicationList";
import type { IRecordMedicationForm } from "@/types/RecordMedicationsType";
import RecordMedicationDialog from "./RecordMedicationDialog";

function RecordMedicationForm({
  recordMedicationField,
  addMedication,
  deleteMedication,
  register,
  getValues,
  setValue,
  errors,
  setError,
}: IRecordMedicationForm) {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  console.log(errors);
  return (
    <Card className="col-span-2 px-4 py-3">
      <div className="flex flex-col">
        <div className="mb-2 flex justify-between">
          <p className="mb-2 text-xl font-semibold">Prescription Medication</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsAdding((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <span>
                  <Plus />
                </span>
                Add Medication
              </>
            )}
          </Button>
        </div>

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
        />
      </div>
    </Card>
  );
}

export default RecordMedicationForm;
