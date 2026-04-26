import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { cn } from "@/lib/utils";
import {
  handleGetGoogleAuthData,
  useBackup,
  useHandleLogout,
} from "@/services/apiBackup";
import { useEffect } from "react";
import { Badge } from "../../shadcn/badge";
import { Separator } from "../../shadcn/separator";
import { CloudBackup } from "lucide-react";
import { Skeleton } from "../../shadcn/skeleton";
import { Spinner } from "../../shadcn/spinner";

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
    <Card className="px-8 py-4">
      <div
        className={cn(
          "flex items-center justify-between",
          isConnected ? "mb-2" : "mb-2",
        )}
      >
        <p className="text-2xl font-semibold">Backup</p>

        <Badge
          className={cn(
            "text-xs",
            isAuthPending
              ? "bg-neutral-200 text-neutral-600"
              : isConnected
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500",
          )}
        >
          {isAuthPending ? (
            <>
              <Spinner /> {"Checking"}
            </>
          ) : isConnected ? (
            "Connected"
          ) : (
            "Not Connected"
          )}
        </Badge>
      </div>

      {isAuthPending ? (
        <div className="space-y-4">
          <Skeleton className="h-14 w-100 bg-neutral-300" />
          <Skeleton className="h-8 w-40 bg-neutral-300" />
        </div>
      ) : (
        <>
          {!isConnected ? (
            <p className="mb-4 max-w-125 text-sm text-neutral-500">
              Connect a Google Drive account to back up all patient data,
              consultation records, and lab results. Backups are stored in your
              own Drive — ClinicSync never holds your data.
            </p>
          ) : (
            <p className="mb-4 max-w-125 text-sm text-neutral-500">
              Your Google Drive is connected. All patient data, consultation
              records, and lab results are securely backed up to your Drive.
            </p>
          )}

          <Separator className="mb-4" />

          {!isConnected && (
            <Button className="cursor-pointer" onClick={handleConnectDrive}>
              Connect to Google Drive
            </Button>
          )}

          {isConnected && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{name}</p>
                  <p>{email}</p>
                </div>

                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => handleLogout()}
                >
                  Disconnect
                </Button>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  className="cursor-pointer"
                  onClick={() => runBackup()}
                  disabled={isBackingup}
                >
                  <CloudBackup />{" "}
                  {isBackingup ? "Backing up..." : "Backup to Google Drive"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default Backup;
