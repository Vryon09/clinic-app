import { useResetDatabase } from "@/services/apiSystem";
import { Button } from "@/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import { Input } from "@/ui/components/shadcn/input";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function ResetDatabase() {
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetInput, setResetInput] = useState<string>("");
  const { mutate: handleResetDatabase } = useResetDatabase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Reset Database</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Permanently delete all patients, records, cases, and clinic data. This action cannot be undone.
        </p>
      </div>

      <Button
        variant="destructive"
        size="sm"
        className="h-9 px-4 font-semibold shadow-xs shrink-0"
        onClick={() => {
          setIsResetting(true);
        }}
      >
        Reset Database
      </Button>

      <Dialog open={isResetting} onOpenChange={setIsResetting}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/80 p-6 shadow-xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5 shrink-0" />
              <DialogTitle className="text-lg font-bold">Reset Database?</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              All patients, consultation records, cases, and user accounts will be permanently deleted. Type{" "}
              <span className="font-semibold text-destructive underline">reset</span> to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Input
              type="text"
              placeholder='Type "reset" to confirm'
              className="h-10 rounded-lg border-border/80 bg-background text-sm"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => setIsResetting(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-9 rounded-lg font-semibold shadow-xs"
                disabled={resetInput !== "reset"}
                onClick={() => {
                  handleResetDatabase();
                  setResetInput("");
                  setIsResetting(false);
                }}
              >
                Confirm Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResetDatabase;

