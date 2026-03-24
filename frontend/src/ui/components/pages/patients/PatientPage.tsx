import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { handleGetRecords, useDeleteRecord } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";

function PatientPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { patientId } = useParams() as { patientId: string };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryKey: ["patient", patientId],
    queryFn: () => handleGetPatient({ id: patientId }),
  });

  const { data: records, isPending: isRecordsPending } = useQuery<IRecord[]>({
    queryKey: ["records", patientId],
    queryFn: () => handleGetRecords(patientId),
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();
  const { mutate: handleDeleteRecord } = useDeleteRecord();

  const navigate = useNavigate();

  if (isPatientPending || isRecordsPending) return <p>Loading...</p>;
  return (
    <div>
      {/* Patient Card */}
      <Card className="mb-4 flex w-fit min-w-96 gap-2 px-4 py-3">
        <div>
          <p className="text-lg font-semibold">Patient Info</p>
          <p>
            Name:{" "}
            {`${patient?.lastName}, ${patient?.firstName}${patient?.middleName ? ` ${patient?.middleName.slice(0, 1)}.` : ""}`}
          </p>
          <p>Age: {dayjs().diff(dayjs(patient?.dateOfBirth), "year")}</p>
          <p>Phone: {patient?.phone}</p>
          <p>Address: {patient?.address}</p>
          <p>
            Sex:{" "}
            <span className="capitalize">{patient?.sex.toLowerCase()}</span>
          </p>
        </div>

        <div className="flex items-center justify-end">
          <Button
            size="icon-sm"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pen />
          </Button>
        </div>
      </Card>

      <Button
        className="cursor-pointer"
        onClick={() => navigate(`/patients/${patient?.id}/consultations/new`)}
      >
        Add Consultation
      </Button>

      <div className="space-y-1">
        {records?.map((record) => (
          <Card
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/patients/${record.patientId}/consultations/${record.id}/details`,
              );
            }}
            key={record.id}
            className="flex cursor-pointer flex-row justify-between px-4 py-1 hover:bg-neutral-200"
          >
            <p className="text-xs">{record.symptoms}</p>
            <div className="flex items-center space-x-2">
              <p className="text-xs">
                {dayjs(record.createdAt).format("MMMM DD, YYYY")}
              </p>
              <Button
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecord(record.id);
                }}
              >
                <Trash />
              </Button>
              <Button
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/patients/${record.patientId}/consultations/${record.id}/edit`,
                  );
                }}
              >
                <Pen />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isEditing && (
        <PatientForm
          action="update"
          handlePatient={(data) =>
            handleUpdatePatient({ ...data, id: patientId })
          }
          initialValues={{
            firstName: patient!.firstName,
            lastName: patient!.lastName,
            phone: patient!.phone,
            address: patient!.address,
            sex: patient!.sex,
            dateOfBirth: new Date(patient!.dateOfBirth),
            middleName: patient?.middleName || "",
          }}
          isOpen={isEditing}
          setIsOpen={() => setIsEditing((prev) => !prev)}
        />
      )}
    </div>
  );
}

export default PatientPage;
