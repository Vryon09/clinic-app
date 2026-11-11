import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/ui/components/shadcn/card";
import { Button } from "@/ui/components/shadcn/button";
import ConfirmDialog from "@/ui/components/common/ConfirmDialog";
import {
  handleGetClinicInfo,
  useDeleteClinicLogo,
  useUploadClinicLogo,
} from "@/services/apiClinicInfo";
import type { IClinicInfo } from "@/types/ClinicInfo";
import { ImagePlus, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

function ClinicLogoSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);

  const { data: clinicInfo, isPending: isClinicInfoPending } =
    useQuery<IClinicInfo>({
      queryFn: handleGetClinicInfo,
      queryKey: ["clinicInfo"],
    });

  const { mutate: uploadLogo, isPending: isUploading } = useUploadClinicLogo();
  const { mutate: deleteLogo, isPending: isDeleting } = useDeleteClinicLogo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (.png, .jpg, .webp, .svg)", {
        position: "top-center",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB", {
        position: "top-center",
      });
      return;
    }

    uploadLogo(file, {
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const logoUrl = clinicInfo?.logoPath
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${clinicInfo.logoPath}`
    : null;

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Clinic Logo</h2>
          <p className="text-xs text-muted-foreground">
            Upload a clinic logo. Only 1 logo is allowed. Uploading another replaces the current logo.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {!logoUrl ? (
        <div
          onClick={triggerFileSelect}
          className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted transition-transform group-hover:scale-105">
            <ImagePlus className="size-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {isUploading ? "Uploading logo..." : "Click to upload clinic logo"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP, or SVG (max. 5MB)
          </p>
          <Button
            type="button"
            size="sm"
            disabled={isUploading || isClinicInfoPending}
            className="mt-4 gap-1.5 h-8 text-xs font-semibold"
          >
            <Upload className="size-3.5" /> Upload Logo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex h-48 w-full items-center justify-center rounded-xl border border-border/80 bg-white p-4 dark:bg-zinc-900">
            <img
              src={logoUrl}
              alt="Clinic Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading || isDeleting}
              onClick={triggerFileSelect}
              className="gap-1.5 h-9 text-xs font-semibold"
            >
              <RefreshCw className={`size-3.5 ${isUploading ? "animate-spin" : ""}`} />
              Replace Logo
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isUploading || isDeleting}
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="gap-1.5 h-9 text-xs font-semibold"
            >
              <Trash2 className="size-3.5" /> Remove Logo
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Remove Clinic Logo?"
        description="Are you sure you want to remove the clinic logo? It will no longer appear on printed consultation reports."
        confirmLabel="Remove"
        onConfirm={() => {
          deleteLogo();
        }}
      />
    </Card>
  );
}

export default ClinicLogoSection;

