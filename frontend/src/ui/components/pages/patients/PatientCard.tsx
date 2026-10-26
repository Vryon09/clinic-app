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
  const patientIdDisplay = patient?.id ? `PT-${patient.id.slice(-6).toUpperCase()}` : "";

  return (
    <Card className="flex h-fit w-full lg:w-84 shrink-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-xs">
      {/* Profile Header */}
      <div className="border-b border-border/60 bg-muted/20 p-6">
        {isPatientPending ? (
          <div className="flex flex-col items-center text-center">
            <Skeleton className="size-16 rounded-2xl bg-muted" />
            <Skeleton className="mt-3 h-5 w-36 bg-muted" />
            <Skeleton className="mt-2 h-4 w-24 bg-muted" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-xs">
              {getInitials(patient?.firstName, patient?.lastName)}
            </div>

            <h2 className="mt-3 text-base font-bold tracking-tight text-foreground">
              {`${patient?.firstName || ""}${
                patient?.middleName ? ` ${patient?.middleName.charAt(0)}.` : ""
              } ${patient?.lastName || ""}`}
            </h2>

            {patientIdDisplay && (
              <span className="mt-1 font-mono text-[11px] font-medium text-muted-foreground">
                {patientIdDisplay}
              </span>
            )}

            <div className="mt-3 flex items-center gap-2">
              <StatusBadge variant="success" dot={true}>
                Active Record
              </StatusBadge>
              <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {patient?.sex === "MALE" ? "Male" : "Female"} · {age} yrs
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Body / Demographics Details */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Demographic Information
          </span>
          <span className="text-[11px] text-muted-foreground">Verified</span>
        </div>

        {isPatientPending ? (
          <div className="space-y-3 pt-1">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            {/* Birthday */}
            <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/15 p-2.5">
              <Calendar className="size-4 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground">Date of Birth</p>
                <p className="font-medium text-foreground">
                  {dayjs(patient?.dateOfBirth).format("MMMM DD, YYYY")}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/15 p-2.5">
              <Phone className="size-4 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground">Contact Phone</p>
                <p className="font-medium text-foreground">{patient?.phone || "No phone listed"}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/15 p-2.5">
              <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground">Residential Address</p>
                <p className="font-medium text-foreground leading-relaxed">
                  {patient?.address || "No address listed"}
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
