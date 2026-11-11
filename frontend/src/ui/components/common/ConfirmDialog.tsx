import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import { Button } from "@/ui/components/shadcn/button";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive">
              <AlertTriangle className="size-5 shrink-0" />
            </div>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row justify-end gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs font-semibold cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            size="sm"
            className="h-9 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

