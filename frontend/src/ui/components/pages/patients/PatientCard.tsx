import type { IPatient } from "@/types/PatientType";
import { Card } from "../../shadcn/card";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { Skeleton } from "../../shadcn/skeleton";
import { Calendar, MapPin, Phone } from "lucide-react";
import StatusBadge from "../../common/StatusBadge";

function PatientCard({
  patient,
  children,
  isPatientPending,
}: {
  patient: IPatient;
  children?: ReactNode;
  isPatientPending: boolean;
}) {
  const getInitials = (first?: string, last?: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "PT";
  };

  const age = patient ? dayjs().diff(dayjs(patient.dateOfBirth), "year") : null;

  return (
    <Card className="flex h-fit w-full lg:w-84 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card p-0 shadow-2xs">
      {/* Profile Header */}
      <div className="border-b border-border bg-muted/30 p-5">
        {isPatientPending ? (
          <div className="flex flex-col items-center text-center">
            <Skeleton className="size-14 rounded-full bg-muted" />
            <Skeleton className="mt-3 h-5 w-36 bg-muted" />
            <Skeleton className="mt-2 h-4 w-24 bg-muted" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-border/80 bg-muted/80 text-lg font-semibold text-foreground ring-1 ring-border/40">
              {getInitials(patient?.firstName, patient?.lastName)}
            </div>

            <h2 className="mt-3 text-base font-bold tracking-tight text-foreground">
              {`${patient?.firstName || ""}${
                patient?.middleName ? ` ${patient?.middleName.charAt(0)}.` : ""
              } ${patient?.lastName || ""}`}
            </h2>


            <div className="mt-3 flex items-center gap-1.5">
              <StatusBadge variant="success" dot={true} className="rounded-md px-2 py-0.5 text-[11px]">
                Active Record
              </StatusBadge>
              <span className="inline-flex items-center rounded-md border border-border/60 bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {patient?.sex === "MALE" ? "M" : "F"} · {age}y
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Body / Demographics Details */}
      <div className="p-4.5 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Demographic Info
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">VERIFIED</span>
        </div>

        {isPatientPending ? (
          <div className="space-y-3 pt-1">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            {/* Birthday */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/20 p-2.5">
              <Calendar className="size-3.5 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Date of Birth</p>
                <p className="font-mono font-medium text-foreground">
                  {dayjs(patient?.dateOfBirth).format("YYYY-MM-DD")} ({age} yrs)
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/20 p-2.5">
              <Phone className="size-3.5 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Contact Phone</p>
                <p className="font-mono font-medium text-foreground">{patient?.phone || "None listed"}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/20 p-2.5">
              <MapPin className="size-3.5 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Residential Address</p>
                <p className="font-medium text-foreground leading-relaxed">
                  {patient?.address || "None listed"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Slot (e.g. Edit Patient) */}
        {children && (
          <div className="pt-3 border-t border-border/60 flex justify-end">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
}

export default PatientCard;
