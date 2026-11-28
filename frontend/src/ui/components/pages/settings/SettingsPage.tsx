import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import Backup from "./backup/Backup";
import GeneralSettings from "./general/GeneralSettings";
import MyProfile from "./accounts/MyProfile";
import Archive from "./archive/Archive";
import ActivityLog from "./activityLog/ActivityLog";
import UserManagement from "./userManagement/UserManagement";
import {
  Building2,
  UserCircle,
  Users,
  History,
  Archive as ArchiveIcon,
  Cloud,
  ArrowLeft,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../../shadcn/button";
import {
  clearPatientReturnContext,
  getPatientReturnContext,
  type PatientNavigationContext,
} from "@/lib/patientNavigation";
import { useAccess } from "@/hooks/useAccess";
import { ReadOnlyNotice } from "../../common/FeatureGate";

function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const { isSuperAdmin, isHidden } = useAccess();
  const canAccessPatients = !isHidden("patients");

  const returnContext: PatientNavigationContext | null = (() => {
    if (!canAccessPatients) return null;
    if (location.state?.returnUrl) {
      return {
        returnUrl: location.state.returnUrl,
        patientName: location.state.patientName,
        contextLabel: location.state.contextLabel,
      };
    }
    return getPatientReturnContext();
  })();

  const defaultTab = !isHidden("settings.general") ? "general" : "myProfile";

  return (
    <div className="space-y-6">
      {returnContext && !isDismissed && (
        <div className="border-primary/25 bg-primary/5 flex flex-col gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-teal-500/30 dark:bg-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg dark:bg-teal-500/20 dark:text-teal-300">
              <ArrowLeft className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xs font-semibold">
                  Active Patient Workspace
                </span>
                {returnContext.contextLabel && (
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium dark:bg-teal-500/20 dark:text-teal-300">
                    {returnContext.contextLabel}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                You were working on{" "}
                <span className="text-foreground font-semibold">
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
              className="text-muted-foreground hover:text-foreground h-8 cursor-pointer text-xs"
            >
              <X className="mr-1 size-3" />
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(returnContext.returnUrl)}
              className="h-8 cursor-pointer gap-1.5 text-xs font-semibold shadow-xs dark:bg-teal-600 dark:text-white dark:hover:bg-teal-500"
            >
              <ArrowLeft className="size-3.5" />
              Back to Patient
            </Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your clinic details, profile, activity logs, data archive, and
          cloud backups.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full space-y-6">
        <TabsList
          variant="line"
          className="bg-muted/40 text-muted-foreground inline-flex h-10 flex-wrap items-center justify-start rounded-lg p-1"
        >
          {!isHidden("settings.general") && (
            <TabsTrigger
              value="general"
              className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Building2 className="size-4" />
              General
            </TabsTrigger>
          )}

          <TabsTrigger
            value="myProfile"
            className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
          >
            <UserCircle className="size-4" />
            My Profile
          </TabsTrigger>

          {isSuperAdmin && (
            <TabsTrigger
              value="userManagement"
              className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Users className="size-4" />
              User Management
            </TabsTrigger>
          )}

          {!isHidden("settings.activityLog") && (
            <TabsTrigger
              value="activityLog"
              className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <History className="size-4" />
              Activity Log
            </TabsTrigger>
          )}

          {!isHidden("settings.archive") && (
            <TabsTrigger
              value="archive"
              className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <ArchiveIcon className="size-4" />
              Archive
            </TabsTrigger>
          )}

          {!isHidden("settings.backup") && (
            <TabsTrigger
              value="backup"
              className="cursor-pointer gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Cloud className="size-4" />
              Backup
            </TabsTrigger>
          )}
        </TabsList>

        {!isHidden("settings.general") && (
          <TabsContent
            value="general"
            className="space-y-4 focus-visible:outline-none"
          >
            <ReadOnlyNotice
              feature="settings.general"
              label="General Settings"
            />
            <GeneralSettings />
          </TabsContent>
        )}

        <TabsContent value="myProfile" className="focus-visible:outline-none">
          <MyProfile />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent
            value="userManagement"
            className="focus-visible:outline-none"
          >
            <UserManagement />
          </TabsContent>
        )}

        {!isHidden("settings.activityLog") && (
          <TabsContent
            value="activityLog"
            className="space-y-4 focus-visible:outline-none"
          >
            <ReadOnlyNotice
              feature="settings.activityLog"
              label="Activity Log"
            />
            <ActivityLog />
          </TabsContent>
        )}

        {!isHidden("settings.archive") && (
          <TabsContent
            value="archive"
            className="space-y-4 focus-visible:outline-none"
          >
            <ReadOnlyNotice feature="settings.archive" label="Archive" />
            <Archive />
          </TabsContent>
        )}

        {!isHidden("settings.backup") && (
          <TabsContent
            value="backup"
            className="space-y-4 focus-visible:outline-none"
          >
            <ReadOnlyNotice feature="settings.backup" label="Backup" />
            <Backup />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default SettingsPage;
