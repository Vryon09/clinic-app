import { Card } from "../../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import Backup from "../backup/Backup";

function SettingsPage() {
  return (
    <div>
      <Tabs defaultValue="backup">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="general" className="cursor-pointer">
            General
          </TabsTrigger>
          <TabsTrigger value="backup" className="cursor-pointer">
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>General</Card>
        </TabsContent>
        <TabsContent value="backup">
          <Backup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
