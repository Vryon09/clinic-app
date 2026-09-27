import { Database, FolderArchive, ArrowRight, Loader2, Building2, Lock, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { SignupForm } from "../../forms/SignupForm";
import { Input } from "../../shadcn/input";
import { Button } from "../../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { useImportBackup } from "@/services/apiBackup";
import { toast } from "sonner";
import { Card } from "../../shadcn/card";

function WelcomeScreen() {
  const [isStartingNew, setIsStartingNew] = useState<boolean>(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [importPassword, setImportPassword] = useState<string>("");

  const backupButtonRef = useRef<HTMLInputElement | null>(null);

  const { mutate: handleImportBackup, isPending: isImporting } = useImportBackup();

  const handleClick = () => {
    if (isImporting) return;
    backupButtonRef.current?.click();
  };

  const processFile = (file: File, password?: string) => {
    handleImportBackup(
      { file, password },
      {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          setPendingFile(null);
          setImportPassword("");
        },
        onError: (err: any) => {
          const msg = err.response?.data?.error || "";
          if (
            msg.toLowerCase().includes("password") ||
            msg.toLowerCase().includes("decrypt") ||
            file.name.endsWith(".enc")
          ) {
            setPendingFile(file);
            setPasswordDialogOpen(true);
          }
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isZip = lowerName.endsWith(".zip");
    const isEnc = lowerName.endsWith(".enc") || lowerName.endsWith(".csync.enc");

    if (!isZip && !isEnc) {
      toast.error("Please select a valid .zip or encrypted .enc backup file.", {
        position: "top-center",
      });
      e.target.value = "";
      return;
    }

    if (isEnc) {
      // Prompt password or attempt decrypt with default key
      setPendingFile(file);
      setPasswordDialogOpen(true);
    } else {
      processFile(file);
    }

    e.target.value = "";
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile) return;
    processFile(pendingFile, importPassword.trim() || undefined);
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
            accept=".zip,.enc,.csync.enc"
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
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    Restore from Backup
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    <ShieldCheck className="size-3" /> Encrypted (.enc/.zip)
                  </span>
                </div>
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
                  ? "Decrypting and restoring clinical database & uploads..."
                  : "Import patient histories, appointments, and configuration from an encrypted or standard backup archive."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Password Dialog for Encrypted Backups */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary pb-1">
                <Lock className="size-5" />
                <DialogTitle>Encrypted Backup Passphrase</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                If this backup was created with a custom password, enter it below.
                If it was created using the standard system key, leave this blank.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Input
                type="password"
                placeholder="Passphrase (optional if system key used)..."
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
                className="text-xs"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setPendingFile(null);
                  setImportPassword("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isImporting}>
                {isImporting ? "Decrypting..." : "Decrypt & Restore"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="text-center">
        <p className="text-[11px] text-muted-foreground">
          ClinicSync Clinical Operating System · Local & Encrypted
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
