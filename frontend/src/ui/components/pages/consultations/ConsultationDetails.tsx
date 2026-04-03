import { handleGetRecord } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Card } from "../../shadcn/card";
import type { IVitalSigns } from "@/types/VitalSignsType";
import { handleGetVitalSigns } from "@/services/apiVitalSigns";
import type { IRecordMedications } from "@/types/RecordMedicationsType";
import { handleGetRecordMedications } from "@/services/apiRecordMedications";

function ConsultationDetails() {
  const { consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: record } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { data: vitalSigns } = useQuery<IVitalSigns>({
    queryFn: () => handleGetVitalSigns(consultationId),
    queryKey: ["vitalSigns", consultationId],
  });

  const { data: recordMedications } = useQuery<IRecordMedications[]>({
    queryFn: () => handleGetRecordMedications(consultationId),
    queryKey: ["recordMedications", consultationId],
  });

  return (
    <div>
      {/* <p className="mb-4 text-4xl font-bold">Record</p> */}
      <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10">
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Visit Details</p>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Symptoms</p>
            <p className="text-neutral-600">{record?.symptoms}</p>
          </Card>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Signs</p>
            <p className="text-neutral-600">{record?.signs}</p>
          </Card>
          <Card className="flex flex-col gap-4 px-4 py-2">
            <p className="text-lg font-semibold">Diagnosis</p>
            <p className="text-neutral-600">{record?.diagnosis}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Vital Signs</p>

          <div className="grid grid-cols-2 gap-2">
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Blood Pressure</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.bloodPressureSystolic}/
                {vitalSigns?.bloodPressureDiastolic}
              </p>
            </Card>
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Temperature</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.temperature}°C
              </p>
            </Card>
            <Card className="flex flex-col gap-4 px-4 py-2">
              <p className="text-lg font-semibold">Weight</p>
              <p className="text-right text-2xl text-neutral-600">
                {vitalSigns?.weightKg}kg
              </p>
            </Card>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-2">
          <p className="mb-2 text-2xl font-semibold">Medications</p>
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

export default ConsultationDetails;
