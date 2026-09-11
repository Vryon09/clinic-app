import { Database, FolderArchive, ArrowRight, Loader2, Building2 } from "lucide-react";
import { useRef, useState } from "react";
import { SignupForm } from "../../forms/SignupForm";
import { Input } from "../../shadcn/input";
import { useImportBackup } from "@/services/apiBackup";
import { toast } from "sonner";
import { Card } from "../../shadcn/card";

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

  if (isStartingNew) {
    return <SignupForm onBack={() => setIsStartingNew(false)} />;
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tracking-wide">
          <Building2 className="size-3.5" />
          <span>System Setup</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to ClinicSync
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Choose how you would like to initialize your clinical practice workstation.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-4">
        {/* Option 1: Start New Clinic */}
        <Card
          onClick={() => !isImporting && setIsStartingNew(true)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Database className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Start New Clinic
                </h3>
                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Set up a fresh clinic database and register your primary administrator account.
              </p>
            </div>
          </div>
        </Card>

        {/* Option 2: Restore from Backup */}
        <Card
          onClick={handleClick}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
        >
          <Input
            ref={backupButtonRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleChange}
            disabled={isImporting}
          />

          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              {isImporting ? (
                <Loader2 className="size-5 animate-spin text-primary group-hover:text-primary-foreground" />
              ) : (
                <FolderArchive className="size-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Restore from Backup
                </h3>
                {isImporting ? (
                  <span className="text-xs font-medium text-primary animate-pulse">
                    Importing...
                  </span>
                ) : (
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {isImporting
                  ? "Extracting clinic database and restoring records. Please wait..."
                  : "Import patient histories, appointments, and configuration from a .zip backup archive."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-[11px] text-muted-foreground">
          ClinicSync Clinical Operating System · Local & Secure
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
