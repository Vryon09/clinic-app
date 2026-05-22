import { Card } from "@/ui/components/shadcn/card";
import { Separator } from "@/ui/components/shadcn/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/ui/components/shadcn/tabs";
import ArchivedPatients from "./archivedPatients/ArchivedPatients";

function Archive() {
  return (
    <Card className="space-y-4 px-8 py-4">
      <div>
        <p className="text-2xl font-semibold">Archive</p>
        <p className="text-sm text-neutral-500">
          View and restore archived patients and their consultation records.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="patients">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="patients" className="cursor-pointer">
            Patients
          </TabsTrigger>

          <TabsTrigger value="consultations" className="cursor-pointer">
            Consultations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <ArchivedPatients />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default Archive;
