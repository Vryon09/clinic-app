import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { cn } from "@/lib/utils";
import {
  handleGetStatus,
  useBackup,
  useHandleLogout,
} from "@/services/apiBackup";
import { useEffect } from "react";

function Backup() {
  const { data: isConnectedData } = useQuery({
    queryKey: ["google-status"],
    queryFn: handleGetStatus,
  });

  const isConnected = isConnectedData?.data.connected;

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
          isConnected ? "mb-4" : "",
        )}
      >
        <p className="text-2xl font-semibold">Backup</p>
        <p
          className={cn(
            "text-sm",
            isConnected ? "text-green-500" : "text-neutral-500",
          )}
        >
          {isConnected ? "Connected" : "Not Connected"}{" "}
        </p>
      </div>
      {!isConnected && (
        <p className="mb-4 text-sm text-neutral-500">
          Connect a Google Drive account to back up all patient data,
          consultation records, and lab results. Backups are stored in your own
          Drive — ClinicSync never holds your data.
        </p>
      )}

      {!isConnected && (
        <Button className="cursor-pointer" onClick={handleConnectDrive}>
          Connect to Google Drive
        </Button>
      )}

      {isConnected && (
        <Button
          className="cursor-pointer"
          onClick={() => runBackup()}
          disabled={isBackingup}
        >
          {isBackingup ? "Backing up..." : "Backup to Google Drive"}
        </Button>
      )}

      {isConnected && (
        <Button className="cursor-pointer" onClick={() => handleLogout()}>
          Logout
        </Button>
      )}
    </Card>
  );
}

export default Backup;
