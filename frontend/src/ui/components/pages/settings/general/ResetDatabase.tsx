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

function ResetDatabase() {
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetInput, setResetInput] = useState<string>("");
  const { mutate: handleResetDatabase } = useResetDatabase();

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">Reset database</p>
        <p className="text-sm">
          Permanently deletes all patients, records, and cases. This can't be
          undone.
        </p>
      </div>

      <Button
        variant="destructive"
        onClick={() => {
          setIsResetting(true);
        }}
      >
        Reset Database
      </Button>

      <Dialog open={isResetting} onOpenChange={setIsResetting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset database?</DialogTitle>
            <DialogDescription>
              All patients, records, cases, and accounts will be permanently
              deleted. Type "<span className="text-red-500">reset</span>" to
              confirm.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
            />
            <Button
              className="mt-4 w-full"
              variant="destructive"
              disabled={resetInput !== "reset"}
              onClick={() => {
                handleResetDatabase();
                setResetInput("");
                setIsResetting(false);
              }}
            >
              Confirm reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResetDatabase;
