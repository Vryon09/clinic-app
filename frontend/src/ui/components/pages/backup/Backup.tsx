import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

function Backup() {
  const { data: isConnectedData } = useQuery({
    queryKey: ["google-status"],
    queryFn: () => api.get("/api/google/status"),
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

  const { mutate: runBackup, isPending } = useMutation({
    mutationFn: () => api.post("/api/backup/drive"),
    // onSuccess: (res) => toast.success(`Backed up: ${res.data.fileName}`),
    // onError: () => toast.error("Backup failed. Try reconnecting Google Drive."),
  });

  async function logout() {
    await api.delete("/api/google");
  }

  function useHandleLogout() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: logout,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["google-status"] }),
      // onError: () => toast.error("Backup failed. Try reconnecting Google Drive."),
    });
  }

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
          disabled={isPending}
        >
          {isPending ? "Backing up..." : "Backup to Google Drive"}
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
