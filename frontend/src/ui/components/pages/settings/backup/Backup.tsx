import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../shadcn/button";
import { Card } from "../../../shadcn/card";
import { cn } from "@/lib/utils";
import {
  handleGetGoogleAuthData,
  useBackup,
  useHandleLogout,
} from "@/services/apiBackup";
import { useEffect, useState } from "react";
import { Badge } from "../../../shadcn/badge";
import { Separator } from "../../../shadcn/separator";
import { CloudBackup, ShieldCheck, KeyRound, Lock } from "lucide-react";
import { Skeleton } from "../../../shadcn/skeleton";
import { Spinner } from "../../../shadcn/spinner";
import { Input } from "../../../shadcn/input";

function Backup() {
  const [useCustomPassword, setUseCustomPassword] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");

  const { data: googleAuthData, isPending: isAuthPending } = useQuery({
    queryKey: ["google-status"],
    queryFn: handleGetGoogleAuthData,
  });

  const isConnected = googleAuthData?.data.connected;
  const email = googleAuthData?.data.email;
  const name = googleAuthData?.data.name;

  const handleConnectDrive = () => {
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "http://localhost:3000/api/google",
      "Google Drive Auth",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["google-status"] });
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, [queryClient]);

  const { mutate: runBackup, isPending: isBackingup } = useBackup();
  const { mutate: handleLogout } = useHandleLogout();

  const handleTriggerBackup = () => {
    runBackup({
      password: useCustomPassword && backupPassword.trim() ? backupPassword.trim() : undefined,
    });
  };

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cloud Backup</h2>
          <p className="text-xs text-muted-foreground">
            Back up patient records, medical history, lab results, and signatures encrypted directly to Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-1 font-medium rounded-full bg-primary/10 text-primary border-primary/30 flex items-center gap-1.5"
          >
            <ShieldCheck className="size-3.5" /> AES-256 Encrypted
          </Badge>

          <Badge
            className={cn(
              "text-xs px-2.5 py-1 font-medium rounded-full shrink-0 shadow-none border",
              isAuthPending
                ? "bg-muted text-muted-foreground border-border"
                : isConnected
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
            )}
          >
            {isAuthPending ? (
              <span className="flex items-center gap-1.5">
                <Spinner className="size-3 text-muted-foreground" /> Checking Status
              </span>
            ) : isConnected ? (
              "Connected"
            ) : (
              "Not Connected"
            )}
          </Badge>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {isAuthPending ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full max-w-md bg-muted/60 rounded-xl" />
          <Skeleton className="h-9 w-36 bg-muted/60 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
                Connect a Google Drive account to back up all patient data, consultation records, and lab results.
                All backups are automatically encrypted with AES-256-GCM before upload so unencrypted sensitive clinical data is never stored in the cloud.
              </p>
              <Button onClick={handleConnectDrive} size="sm" className="h-9 gap-2 rounded-lg font-semibold shadow-xs">
                <CloudBackup className="size-4" /> Connect to Google Drive
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CloudBackup className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => handleLogout()}
                >
                  Disconnect Account
                </Button>
              </div>

              {/* Security Details */}
              <div className="rounded-xl border border-border/70 bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Backup Encryption Security</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setUseCustomPassword(!useCustomPassword)}
                  >
                    <KeyRound className="size-3.5 mr-1" />
                    {useCustomPassword ? "Use System Master Key" : "Set Custom Passphrase"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {useCustomPassword
                    ? "Custom passphrase mode: You must remember this passphrase to restore or import this backup."
                    : "Backups are automatically secured with the system master key before uploading."}
                </p>

                {useCustomPassword && (
                  <div className="pt-2 max-w-sm">
                    <Input
                      type="password"
                      placeholder="Enter custom backup passphrase..."
                      value={backupPassword}
                      onChange={(e) => setBackupPassword(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleTriggerBackup}
                  disabled={isBackingup}
                  size="sm"
                  className="h-9 px-5 gap-2 rounded-lg font-semibold shadow-xs"
                >
                  <CloudBackup className="size-4" />
                  {isBackingup ? "Encrypting & Backing up..." : "Backup to Google Drive"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default Backup;
