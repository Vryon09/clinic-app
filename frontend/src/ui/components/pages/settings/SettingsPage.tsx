import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import Backup from "./backup/Backup";
import GeneralSettings from "./general/GeneralSettings";
import ManageAccounts from "./accounts/ManageAccounts";
import Archive from "./archive/Archive";
import ActivityLog from "./activityLog/ActivityLog";
import { Building2, Users, History, Archive as ArchiveIcon, Cloud, ArrowLeft, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../../shadcn/button";
import {
  clearPatientReturnContext,
  getPatientReturnContext,
  type PatientNavigationContext,
} from "@/lib/patientNavigation";

function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  const returnContext: PatientNavigationContext | null = (() => {
    if (location.state?.returnUrl) {
      return {
        returnUrl: location.state.returnUrl,
        patientName: location.state.patientName,
        contextLabel: location.state.contextLabel,
      };
    }
    return getPatientReturnContext();
  })();

  return (
    <div className="space-y-6">
      {returnContext && !isDismissed && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs dark:border-teal-500/30 dark:bg-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-teal-500/20 dark:text-teal-300">
              <ArrowLeft className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Active Patient Workspace
                </span>
                {returnContext.contextLabel && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary dark:bg-teal-500/20 dark:text-teal-300">
                    {returnContext.contextLabel}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                You were working on{" "}
                <span className="font-semibold text-foreground">
                  {returnContext.patientName || "a patient record"}
                </span>
                . Return when you finish updating settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsDismissed(true);
                clearPatientReturnContext();
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="mr-1 size-3" />
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(returnContext.returnUrl)}
              className="h-8 gap-1.5 text-xs font-semibold shadow-xs cursor-pointer dark:bg-teal-600 dark:text-white dark:hover:bg-teal-500"
            >
              <ArrowLeft className="size-3.5" />
              Back to Patient
            </Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your clinic details, accounts, activity logs, data archive, and cloud backups.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList variant="line" className="inline-flex h-10 items-center justify-start rounded-lg bg-muted/40 p-1 text-muted-foreground">
          <TabsTrigger value="general" className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold">
            <Building2 className="size-4" />
            General
          </TabsTrigger>

          <TabsTrigger value="manageAccounts" className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold">
            <Users className="size-4" />
            Accounts
          </TabsTrigger>

          <TabsTrigger value="activityLog" className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold">
            <History className="size-4" />
            Activity Log
          </TabsTrigger>

          <TabsTrigger value="archive" className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold">
            <ArchiveIcon className="size-4" />
            Archive
          </TabsTrigger>

          <TabsTrigger value="backup" className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold">
            <Cloud className="size-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="focus-visible:outline-none">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="manageAccounts" className="focus-visible:outline-none">
          <ManageAccounts />
        </TabsContent>

        <TabsContent value="activityLog" className="focus-visible:outline-none">
          <ActivityLog />
        </TabsContent>

        <TabsContent value="archive" className="focus-visible:outline-none">
          <Archive />
        </TabsContent>

        <TabsContent value="backup" className="focus-visible:outline-none">
          <Backup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;

