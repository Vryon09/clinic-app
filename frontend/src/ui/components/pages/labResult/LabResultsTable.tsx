import type { ILabResult } from "@/types/LabResultType";
import dayjs from "dayjs";
import { ExternalLink, FileText, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";
import { useDeleteLabResult } from "@/services/apiLabResults";
import { Skeleton } from "../../shadcn/skeleton";

function LabResultsTable({
  labResults,
  isLabResultsPending,
}: {
  labResults: ILabResult[];
  isLabResultsPending: boolean;
}) {
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();

  // ── Loading skeleton ─────────────────────────────────────────
  if (isLabResultsPending) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/80">
        {/* Fake header */}
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <Skeleton className="h-3.5 w-10 rounded bg-muted" />
          <Skeleton className="h-3.5 w-16 rounded bg-muted" />
          <div className="w-8" />
        </div>
        {/* Fake rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border/50 px-4 py-3 last:border-0"
          >
            <Skeleton className="h-4 w-32 rounded bg-muted/60" />
            <Skeleton className="h-5 w-12 rounded-full bg-muted/60" />
            <Skeleton className="h-7 w-7 rounded-lg bg-muted/60" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────
  if (!labResults?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-12 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileText className="size-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          No Lab Results
        </h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          No laboratory results have been uploaded for this patient yet. Click
          &ldquo;Upload File&rdquo; above to add one.
        </p>
      </div>
    );
  }

  // ── Results table ────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground">Date</p>
        <p className="text-xs font-semibold text-muted-foreground">File Type</p>
        <div className="w-8" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {labResults.map((result) => {
          const pathSplit = result.filePath.split("\\");
          const fileName = pathSplit[pathSplit.length - 1]
            .split("-")
            .slice(1)
            .join()
            .split(".")[1]
            .toUpperCase();

          return (
            <div
              key={result.id}
              className="grid cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-muted/20"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`http://localhost:3000/${result.filePath}`);
              }}
            >
              {/* Date + open hint */}
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <FileText className="size-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {dayjs(result.uploadedAt).format("MMM DD, YYYY")}
                  </p>
                  <p className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <ExternalLink className="size-2.5" /> Open file
                  </p>
                </div>
              </div>

              {/* File type badge */}
              <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                {fileName}
              </span>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="size-8 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLabResult(result.id);
                    }}
                  >
                    <Trash className="size-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LabResultsTable;
