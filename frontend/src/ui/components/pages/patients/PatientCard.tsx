import type { IPatient } from "@/types/PatientType";
import { Card } from "../../shadcn/card";
import dayjs from "dayjs";
import type { ReactNode } from "react";

function PatientCard({
  patient,
  children,
}: {
  patient: IPatient;
  children?: ReactNode;
}) {
  return (
    <Card className="flex w-fit min-w-96 flex-col gap-2 px-4 py-3">
      <div>
        <p className="text-lg font-semibold">Patient Info</p>
        <p>
          Name:{" "}
          {`${patient?.lastName}, ${patient?.firstName}${patient?.middleName ? ` ${patient?.middleName.slice(0, 1)}.` : ""}`}
        </p>
        <p>Birthday: {dayjs(patient?.dateOfBirth).format("MMMM DD, YYYY")}</p>
        <p>Age: {dayjs().diff(dayjs(patient?.dateOfBirth), "year")}</p>
        <p>Address: {patient?.address}</p>
        <p>Phone: {patient?.phone}</p>
        <p>
          Sex: <span className="capitalize">{patient?.sex.toLowerCase()}</span>
        </p>
      </div>

      {children}
    </Card>
  );
}

export default PatientCard;
