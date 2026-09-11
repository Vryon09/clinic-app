import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import Backup from "./backup/Backup";
import GeneralSettings from "./general/GeneralSettings";
import ManageAccounts from "./accounts/ManageAccounts";
import Archive from "./archive/Archive";
import ActivityLog from "./activityLog/ActivityLog";
import { Building2, Users, History, Archive as ArchiveIcon, Cloud } from "lucide-react";

function SettingsPage() {
  return (
    <div className="space-y-6">
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

