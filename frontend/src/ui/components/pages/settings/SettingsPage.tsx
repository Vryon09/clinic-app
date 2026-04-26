import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import Backup from "../backup/Backup";
import ManageAccounts from "./ManageAccounts";

function SettingsPage() {
  return (
    <div>
      <Tabs defaultValue="manageAccounts">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="manageAccounts" className="cursor-pointer">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="backup" className="cursor-pointer">
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manageAccounts">
          <ManageAccounts />
        </TabsContent>
        <TabsContent value="backup">
          <Backup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
