import type { IAddedRecordMedicationList } from "@/types/RecordMedicationsType";
import { Button } from "@/ui/components/shadcn/button";
import { Card } from "@/ui/components/shadcn/card";
import { Trash2 } from "lucide-react";

function AddedRecordMedicationList({
  recordMedicationField,
  deleteMedication,
}: IAddedRecordMedicationList) {
  return (
    <div className="mb-2">
      <p className="font-semibold">
        Added medication ({recordMedicationField.length})
      </p>

      <div className="mt-2 space-y-2">
        {!recordMedicationField.length ? (
          <p className="text-muted-foreground text-center text-sm">
            No added medication. Click "Add Medication" button to add.
          </p>
        ) : (
          recordMedicationField.map((medication, i) => (
            <Card key={medication.id} className="flex flex-col gap-4 px-4 py-2">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">{medication.name}</p>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => deleteMedication(i)}
                  className="cursor-pointer"
                >
                  <Trash2 />
                </Button>
              </div>

              <div className="grid grid-cols-3">
                <div>
                  <p className="text-sm uppercase">Dosage</p>
                  <p className="font-semibold">{medication.dosage}</p>
                </div>

                <div>
                  <p className="text-sm uppercase">Frequency</p>
                  <p className="font-semibold">{medication.frequency}</p>
                </div>

                <div>
                  <p className="text-sm uppercase">Duration Days</p>
                  <p className="font-semibold">
                    {medication.durationDays}{" "}
                    {medication.durationDays
                      ? medication.durationDays > 1
                        ? "days"
                        : "day"
                      : ""}
                  </p>
                </div>
              </div>

              <div className="border-t pt-2">
                <p className="text-sm uppercase">Instructions</p>
                <p className="text-neutral-700">
                  {medication.instructions ? medication.instructions : "N/A"}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default AddedRecordMedicationList;
