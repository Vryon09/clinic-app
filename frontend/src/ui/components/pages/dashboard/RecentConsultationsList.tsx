import { useState, useMemo } from "react";
import { Card } from "../../shadcn/card";
import type { RecentConsultationItem } from "@/types/DashboardType";
import { Link } from "react-router";
import dayjs from "dayjs";
import { ArrowUpRight, Clock } from "lucide-react";
import PaginationBar from "../../PaginationBar";

interface RecentConsultationsListProps {
  consultations: RecentConsultationItem[];
}

export function RecentConsultationsList({
  consultations,
}: RecentConsultationsListProps) {
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const totalPages = Math.ceil(consultations.length / pageSize) || 1;
  const clampedPage = Math.min(page, totalPages);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (clampedPage - 1) * pageSize;
    return consultations.slice(startIndex, startIndex + pageSize);
  }, [consultations, clampedPage, pageSize]);

  const paginationData = {
    page: clampedPage,
    limit: pageSize,
    total: consultations.length,
    pages: totalPages,
  };

  return (
    <Card className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <div>
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Recent Consultations</h3>
            <p className="text-xs text-muted-foreground">Latest patient encounters</p>
          </div>
          <Link
            to="/patients"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>View all</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {!consultations.length ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No consultations recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {paginatedConsultations.map((c) => (
              <Link
                key={c.id}
                to={`/patients/${c.patient.id}/consultations/${c.id}/details`}
                className="flex items-center justify-between py-2.5 transition-colors hover:bg-muted/40 rounded-lg px-2 -mx-2"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground truncate">
                      {c.patient.lastName}, {c.patient.firstName}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {c.case.caseName}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {c.diagnosis ? `Dx: ${c.diagnosis}` : "No formal diagnosis entered"}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-right text-[11px] text-muted-foreground shrink-0">
                  <Clock className="size-3 text-muted-foreground/70" />
                  <span>{dayjs(c.visitDate).format("MMM D, YYYY")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {consultations.length > pageSize && (
        <PaginationBar
          itemName="Consultation"
          paginationData={paginationData}
          setPage={setPage}
          isLoading={false}
        />
      )}
    </Card>
  );
}
