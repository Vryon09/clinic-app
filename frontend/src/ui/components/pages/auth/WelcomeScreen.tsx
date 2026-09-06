import { Database, Import, Loader2 } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useRef, useState } from "react";
import { SignupForm } from "../../forms/SignupForm";
import { Input } from "../../shadcn/input";
import { useImportBackup } from "@/services/apiBackup";
import { toast } from "sonner";

function WelcomeScreen() {
  const [isStartingNew, setIsStartingNew] = useState<boolean>(false);
  const backupButtonRef = useRef<HTMLInputElement | null>(null);

  const { mutate: handleImportBackup, isPending: isImporting } = useImportBackup();

  const handleClick = () => {
    if (isImporting) return;
    backupButtonRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please select a valid .zip backup file.", {
        position: "top-center",
      });
      e.target.value = "";
      return;
    }

    handleImportBackup(
      { file },
      {
        onSettled: () => {
          if (e.target) {
            e.target.value = "";
          }
        },
      }
    );
  };

  if (isStartingNew) return <SignupForm />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-semibold">Welcome to ClinicSync</h1>
        <p className="mt-2 text-muted-foreground">What would you like to do?</p>
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={() => setIsStartingNew(true)} disabled={isImporting}>
          <Database /> Start new clinic
        </Button>

        <div>
          <Input
            ref={backupButtonRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleChange}
            disabled={isImporting}
          />

          <Button className="w-full" onClick={handleClick} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="animate-spin" />
                Importing backup...
              </>
            ) : (
              <>
                <Import />
                Import backup
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
