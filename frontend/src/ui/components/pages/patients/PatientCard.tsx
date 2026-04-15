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
    <Card className="flex min-w-86 flex-col gap-2 px-4 py-4">
      <div>
        <p className="text-lg font-semibold">
          {`${patient?.firstName}${patient?.middleName ? ` ${patient?.middleName.slice(0, 1)}.` : ""} ${patient?.lastName}`}
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2">
            <p className="text-neutral-500">Birthday</p>
            <p>{dayjs(patient?.dateOfBirth).format("MMMM DD, YYYY")}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="text-neutral-500">Age</p>
            <p>{dayjs().diff(dayjs(patient?.dateOfBirth), "year")}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="text-neutral-500">Sex</p>
            <p className="capitalize">{patient?.sex.toLowerCase()}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="text-neutral-500">Phone</p>
            <p> {patient?.phone}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="text-neutral-500">Address</p>
            <p>{patient?.address}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-end justify-end">{children}</div>
    </Card>
  );
}

export default PatientCard;
