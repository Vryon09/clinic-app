import { useState } from "react";
import type { ILabResult } from "@/types/LabResultType";
import dayjs from "dayjs";
import {
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  ImageIcon,
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
import EmptyState from "../../common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";

function getFileExtension(path: string): string {
  const parts = path.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
}

function getFileIcon(ext: string) {
  if (["PNG", "JPG", "JPEG", "WEBP", "GIF"].includes(ext)) {
    return <ImageIcon className="size-4 text-emerald-600" />;
  }
  if (["XLS", "XLSX", "CSV"].includes(ext)) {
    return <FileSpreadsheet className="size-4 text-amber-600" />;
  }
  return <FileText className="size-4 text-primary" />;
}

function LabResultsTable({
  labResults,
  isLabResultsPending,
}: {
  labResults: ILabResult[];
  isLabResultsPending: boolean;
}) {
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();
  const [openingId, setOpeningId] = useState<string | null>(null);

  // In-app preview state
  const [previewResult, setPreviewResult] = useState<{
    id: string;
    url: string;
    ext: string;
    uploadedAt: Date;
  } | null>(null);

  const handleOpenPreview = async (e: React.MouseEvent, result: ILabResult) => {
    e.stopPropagation();
    const ext = getFileExtension(result.filePath);
    try {
      setOpeningId(result.id);
      const blob = await handleGetLabResultFile(result.id);
      const fileUrl = URL.createObjectURL(blob);
      setPreviewResult({
        id: result.id,
        url: fileUrl,
        ext,
        uploadedAt: result.uploadedAt,
      });
    } catch (error) {
      toast.error("Failed to load lab result preview", {
        position: "top-center",
      });
      console.error(error);
    } finally {
      setOpeningId(null);
    }
  };

  const handleOpenExternal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setOpeningId(id);
      const blob = await handleGetLabResultFile(id);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (error) {
      toast.error("Failed to open file", { position: "top-center" });
      console.error(error);
    } finally {
      setOpeningId(null);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────
  if (isLabResultsPending) {
    return (
      <div className="border-border/80 overflow-hidden rounded-xl border">
        <div className="border-border/60 bg-muted/30 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-2.5">
          <Skeleton className="bg-muted h-3.5 w-10 rounded" />
          <Skeleton className="bg-muted h-3.5 w-16 rounded" />
          <div className="w-8" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
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
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-6 text-center">
        <EmptyState
          title="No Lab Results"
          description="No laboratory diagnostic results have been uploaded for this patient yet."
          showMascot={false}
        />
      </div>
    );
  }

  return (
    <>
      <div className="border-border/80 overflow-hidden rounded-xl border bg-card shadow-2xs">
        {/* Header */}
        <div className="border-border/60 bg-muted/30 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-2.5 text-xs font-semibold text-muted-foreground font-mono">
          <span>Diagnostic Document &amp; Date</span>
          <span>Format</span>
          <div className="w-20 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-border/50 divide-y">
          {labResults.map((result) => {
            const ext = getFileExtension(result.filePath);

            return (
              <div
                key={result.id}
                className="hover:bg-muted/20 grid cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 transition-colors duration-150"
                onClick={(e) => handleOpenPreview(e, result)}
              >
                {/* Date + File Icon */}
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    {openingId === result.id ? (
                      <Loader2 className="text-primary size-4 animate-spin" />
                    ) : (
                      getFileIcon(ext)
                    )}
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-semibold">
                      Diagnostic Report &mdash; {dayjs(result.uploadedAt).format("MMM DD, YYYY")}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Eye className="size-3 text-primary/70" /> Click to preview in-app
                    </p>
                  </div>
                </div>

                {/* File format badge */}
                <span className="border-border/70 bg-muted/50 text-foreground rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold">
                  {ext}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Open in new window"
                    onClick={(e) => handleOpenExternal(e, result.id)}
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="size-8 shrink-0 cursor-pointer"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => handleDeleteLabResult(result.id)}
                      >
                        <Trash className="size-3.5" /> Delete Result
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-App Document Preview Dialog */}
      {previewResult && (
        <Dialog
          open={!!previewResult}
          onOpenChange={(open) => {
            if (!open) {
              if (previewResult.url) {
                URL.revokeObjectURL(previewResult.url);
              }
              setPreviewResult(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
            <DialogHeader className="p-4 px-5 bg-muted/20 border-b border-border/60 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Diagnostic Result Preview
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Uploaded on {dayjs(previewResult.uploadedAt).format("MMMM DD, YYYY")} &middot; Format: {previewResult.ext}
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2 mr-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 rounded-lg text-xs cursor-pointer"
                  onClick={() => window.open(previewResult.url, "_blank")}
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Tab</span>
                </Button>
                <a
                  href={previewResult.url}
                  download={`lab-result-${previewResult.id}.${previewResult.ext.toLowerCase()}`}
                  className="inline-flex"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Download</span>
                  </Button>
                </a>
              </div>
            </DialogHeader>

            {/* Viewer Canvas */}
            <div className="bg-muted/30 p-4 max-h-[75vh] min-h-[50vh] flex items-center justify-center overflow-auto">
              {["PNG", "JPG", "JPEG", "WEBP", "GIF"].includes(previewResult.ext) ? (
                <img
                  src={previewResult.url}
                  alt="Laboratory Result"
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain border border-border bg-background shadow-xs"
                />
              ) : previewResult.ext === "PDF" ? (
                <iframe
                  src={previewResult.url}
                  title="PDF Lab Result"
                  className="h-[70vh] w-full rounded-lg border border-border bg-background shadow-xs"
                />
              ) : (
                <div className="text-center p-8 border border-dashed border-border rounded-xl bg-card">
                  <FileText className="size-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">
                    Direct Preview Unavailable for .{previewResult.ext}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Please download or open the document in an external viewer.
                  </p>
                  <a
                    href={previewResult.url}
                    download={`lab-result-${previewResult.id}.${previewResult.ext.toLowerCase()}`}
                  >
                    <Button size="sm" className="gap-1.5 text-xs">
                      <Download className="size-3.5" />
                      Download File
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default LabResultsTable;
