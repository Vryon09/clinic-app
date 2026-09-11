import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../shadcn/button";
import { Card } from "../../../shadcn/card";
import { cn } from "@/lib/utils";
import {
  handleGetGoogleAuthData,
  useBackup,
  useHandleLogout,
} from "@/services/apiBackup";
import { useEffect } from "react";
import { Badge } from "../../../shadcn/badge";
import { Separator } from "../../../shadcn/separator";
import { CloudBackup } from "lucide-react";
import { Skeleton } from "../../../shadcn/skeleton";
import { Spinner } from "../../../shadcn/spinner";

function Backup() {
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

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["google-status"] });
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, [queryClient]);

  const { mutate: runBackup, isPending: isBackingup } = useBackup();

  const { mutate: handleLogout } = useHandleLogout();

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cloud Backup</h2>
          <p className="text-xs text-muted-foreground">
            Back up patient records, consultation history, and lab results directly to Google Drive.
          </p>
        </div>

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
                Backups are securely stored in your own Google Drive container — ClinicSync never holds your private data.
              </p>
              <Button onClick={handleConnectDrive} size="sm" className="h-9 gap-2 rounded-lg font-semibold shadow-xs">
                <CloudBackup className="size-4" /> Connect to Google Drive
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
                Your Google Drive is connected. You can trigger an instant backup of all clinic records anytime.
              </p>

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

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => runBackup()}
                  disabled={isBackingup}
                  size="sm"
                  className="h-9 px-5 gap-2 rounded-lg font-semibold shadow-xs"
                >
                  <CloudBackup className="size-4" />
                  {isBackingup ? "Backing up data..." : "Backup to Google Drive"}
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
