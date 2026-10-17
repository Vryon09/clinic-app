import {
  Database,
  FolderArchive,
  ArrowRight,
  Loader2,
  Building2,
  Lock,
  ShieldCheck,
} from "lucide-react";
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
import { AppLogo } from "../../common/AppLogo";

function WelcomeScreen() {
  const [isStartingNew, setIsStartingNew] = useState<boolean>(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [importPassword, setImportPassword] = useState<string>("");

  const backupButtonRef = useRef<HTMLInputElement | null>(null);

  const { mutate: handleImportBackup, isPending: isImporting } =
    useImportBackup();

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
      },
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isZip = lowerName.endsWith(".zip");
    const isEnc =
      lowerName.endsWith(".enc") || lowerName.endsWith(".csync.enc");

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
      <div className="flex flex-col items-center space-y-4 text-center">
        <div>
          <div className="flex w-full items-center justify-center">
            <AppLogo variant="full" className="size-32" />
          </div>
          <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
            <Building2 className="size-3.5" />
            <span>System Setup</span>
          </div>
        </div>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          Choose how you would like to initialize your clinical practice
          workstation.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-4">
        {/* Option 1: Start New Clinic */}
        <Card
          onClick={() => !isImporting && setIsStartingNew(true)}
          className="group border-border/80 bg-card hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all hover:shadow-md active:scale-[0.99]"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors">
              <Database className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-base font-semibold tracking-tight">
                  Start New Clinic
                </h3>
                <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Set up a fresh clinic database and register your primary
                administrator account.
              </p>
            </div>
          </div>
        </Card>

        {/* Option 2: Restore from Backup */}
        <Card
          onClick={handleClick}
          className="group border-border/80 bg-card hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all hover:shadow-md active:scale-[0.99]"
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
            <div className="bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors">
              {isImporting ? (
                <Loader2 className="text-primary group-hover:text-primary-foreground size-5 animate-spin" />
              ) : (
                <FolderArchive className="size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-base font-semibold tracking-tight">
                    Restore from Backup
                  </h3>
                  <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                    <ShieldCheck className="size-3" /> Encrypted (.enc/.zip)
                  </span>
                </div>
                {isImporting ? (
                  <span className="text-primary animate-pulse text-xs font-medium">
                    Importing...
                  </span>
                ) : (
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
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
              <div className="text-primary flex items-center gap-2 pb-1">
                <Lock className="size-5" />
                <DialogTitle>Encrypted Backup Passphrase</DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                If this backup was created with a custom password, enter it
                below. If it was created using the standard system key, leave
                this blank.
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
        <p className="text-muted-foreground text-[11px]">
          ClinicSync Clinical Operating System · Local & Encrypted
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
