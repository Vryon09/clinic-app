import { handleGetPatient, useUpdatePatient } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { handleGetRecords } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { Pen } from "lucide-react";
import { useState } from "react";
import PatientForm from "./PatientForm";

function PatientPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams() as { id: string };

  const { data: patient, isPending: isPatientPending } = useQuery<IPatient>({
    queryKey: ["patient", id],
    queryFn: () => handleGetPatient({ id }),
  });

  const { data: records, isPending: isRecordsPending } = useQuery<IRecord[]>({
    queryKey: ["records", id],
    queryFn: () => handleGetRecords(id),
  });

  const { mutate: handleUpdatePatient } = useUpdatePatient();

  const navigate = useNavigate();

  if (isPatientPending || isRecordsPending) return <p>Loading...</p>;
  return (
    <div>
      {/* Patient Card */}
      <div>
        <div>
          <p>name</p>
          <p>{`${patient?.lastName}, ${patient?.firstName}${patient?.middleName ? ` ${patient?.middleName.slice(0, 1)}.` : ""}`}</p>
        </div>

        <div>
          <p>Patient Info</p>
          <div>
            <p>age</p>
            <p>{dayjs().diff(dayjs(patient?.dateOfBirth), "year")}</p>
          </div>
          <div>
            <p>phone</p>
            <p>{patient?.phone}</p>
          </div>
        </div>
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

      <Button
        className="cursor-pointer"
        onClick={() => navigate(`/consultations/${patient?.id}`)}
      >
        Add Consultation
      </Button>

      <div className="space-y-1">
        {records?.map((record) => (
          <Card
            key={record.id}
            className="flex cursor-pointer flex-row justify-between px-4 py-1 hover:bg-neutral-200"
          >
            <p className="text-xs">{record.chiefComplaint}</p>
            <p className="text-xs">
              {dayjs(record.createdAt).format("MMMM DD, YYYY")}
            </p>
          </Card>
        ))}
      </div>

      {isEditing && (
        <PatientForm
          action="update"
          handlePatient={(data) => handleUpdatePatient({ ...data, id })}
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
          setIsOpen={setIsEditing}
        />
      )}
    </div>
  );
}

export default PatientPage;
