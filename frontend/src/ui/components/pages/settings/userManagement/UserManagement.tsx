import { useState } from "react";
import { Shield, Users } from "lucide-react";
import { Card } from "../../../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shadcn/tabs";
import UsersPanel from "./UsersPanel";
import RolesPanel from "./RolesPanel";

function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          User Management
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage clinic staff accounts, custom roles, permissions, and feature
          visibility.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-5">
        <TabsList className="inline-flex h-9 items-center rounded-lg bg-muted/50 p-1">
          <TabsTrigger
            value="users"
            className="cursor-pointer gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <Users className="size-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="cursor-pointer gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <Shield className="size-3.5" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="focus-visible:outline-none">
          <UsersPanel />
        </TabsContent>

        <TabsContent value="roles" className="focus-visible:outline-none">
          <RolesPanel />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default UserManagement;
