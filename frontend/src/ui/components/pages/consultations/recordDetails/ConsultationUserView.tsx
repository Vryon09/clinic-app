import { Card } from "../../../shadcn/card";
import type { IRecord } from "@/types/RecordType";
import type { IVitalSigns } from "@/types/VitalSignsType";
import type { IRecordMedications } from "@/types/RecordMedicationsType";

function ConsultationUserView({
  record,
  vitalSigns,
  recordMedications,
}: {
  record: IRecord;
  vitalSigns: IVitalSigns;
  recordMedications: IRecordMedications[];
}) {
  return (
    <div className="pb-8">
      <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10">
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Visit Details</p>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Symptoms</p>
            <p className="text-neutral-600">
              {record?.symptoms ? record?.symptoms : "N/A"}
            </p>
          </Card>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Signs</p>
            <p className="text-neutral-600">
              {record?.signs ? record?.signs : "N/A"}
            </p>
          </Card>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Diagnosis</p>
            <p className="text-neutral-600">
              {record?.diagnosis ? record?.diagnosis : "N/A"}
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Vital Signs</p>

          <div className="grid grid-cols-2 gap-2">
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Blood Pressure</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.bloodPressureSystolic &&
                vitalSigns?.bloodPressureDiastolic
                  ? `${vitalSigns?.bloodPressureSystolic}/${vitalSigns?.bloodPressureDiastolic}`
                  : "N/A"}
              </p>
            </Card>
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Temperature</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.temperature
                  ? `${vitalSigns?.temperature}°C`
                  : "N/A"}
              </p>
            </Card>
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Weight</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.weightKg ? `${vitalSigns?.weightKg}kg` : "N/A"}
              </p>
            </Card>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Medications</p>
          {recordMedications.length === 0 && (
            <p className="text-center">No Medications Added</p>
          )}
          {recordMedications?.map((medication) => (
            <Card key={medication.id} className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">{medication.name}</p>

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
                <p className="text-neutral-700">{medication.instructions}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConsultationUserView;
