import { useState } from "react";
import type { ILabResult } from "@/types/LabResultType";
import dayjs from "dayjs";
import {
  ExternalLink,
  FileText,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";
import {
  handleGetLabResultFile,
  useDeleteLabResult,
} from "@/services/apiLabResults";
import { Skeleton } from "../../shadcn/skeleton";
import { toast } from "sonner";

function LabResultsTable({
  labResults,
  isLabResultsPending,
}: {
  labResults: ILabResult[];
  isLabResultsPending: boolean;
}) {
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();
  const [openingId, setOpeningId] = useState<string | null>(null);

  const handleOpenFile = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setOpeningId(id);
      const blob = await handleGetLabResultFile(id);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (error) {
      toast.error("Failed to open lab result file", {
        position: "top-center",
      });
      console.error(error);
    } finally {
      setOpeningId(null);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────
  if (isLabResultsPending) {
    return (
      <div className="border-border/80 overflow-hidden rounded-xl border">
        {/* Fake header */}
        <div className="border-border/60 bg-muted/30 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-2.5">
          <Skeleton className="bg-muted h-3.5 w-10 rounded" />
          <Skeleton className="bg-muted h-3.5 w-16 rounded" />
          <div className="w-8" />
        </div>
        {/* Fake rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-border/50 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="bg-muted/60 h-4 w-32 rounded" />
            <Skeleton className="bg-muted/60 h-5 w-12 rounded-full" />
            <Skeleton className="bg-muted/60 h-7 w-7 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────
  if (!labResults?.length) {
    return (
      <div className="border-border/70 bg-card/50 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <div className="bg-muted text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-xl">
          <FileText className="size-5" />
        </div>
        <h3 className="text-foreground text-sm font-semibold">
          No Lab Results
        </h3>
        <p className="text-muted-foreground mt-1 max-w-xs text-xs">
          No laboratory results have been uploaded for this patient yet. Click
          &ldquo;Upload File&rdquo; above to add one.
        </p>
      </div>
    );
  }

  // ── Results table ────────────────────────────────────────────
  return (
    <div className="border-border/80 overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="border-border/60 bg-muted/30 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-2.5">
        <p className="text-muted-foreground text-xs font-semibold">Date</p>
        <p className="text-muted-foreground text-xs font-semibold">File Type</p>
        <div className="w-8" />
      </div>

      {/* Rows */}
      <div className="divide-border/50 divide-y">
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
              className="hover:bg-muted/20 grid cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 transition-colors duration-150"
              onClick={(e) => handleOpenFile(e, result.id)}
            >
              {/* Date + open hint */}
              <div className="flex items-center gap-2">
                <div className="bg-primary/8 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                  {openingId === result.id ? (
                    <Loader2 className="text-primary size-3.5 animate-spin" />
                  ) : (
                    <FileText className="size-3.5" />
                  )}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {dayjs(result.uploadedAt).format("MMM DD, YYYY")}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-0.5 text-[10px]">
                    {openingId === result.id ? (
                      "Loading..."
                    ) : (
                      <>
                        <ExternalLink className="size-2.5" /> Open file
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* File type badge */}
              <span className="border-border/70 bg-muted/40 text-foreground rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
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
