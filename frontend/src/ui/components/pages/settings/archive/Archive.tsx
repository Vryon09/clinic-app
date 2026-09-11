import { Card } from "@/ui/components/shadcn/card";
import { Separator } from "@/ui/components/shadcn/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/ui/components/shadcn/tabs";
import ArchivedPatients from "./archivedPatients/ArchivedPatients";
import ArchivedRecords from "./archivedRecords/ArchivedRecords";
import ArchivedCases from "./archivedCase/ArchivedCases";

function Archive() {
  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Archive Storage</h2>
        <p className="text-xs text-muted-foreground">
          View and restore archived patients, consultation records, and clinical cases.
        </p>
      </div>

      <Separator className="bg-border/60" />

      <Tabs defaultValue="patients" className="w-full space-y-4">
        <TabsList variant="line" className="inline-flex h-9 items-center justify-start rounded-lg bg-muted/40 p-1 text-muted-foreground">
          <TabsTrigger value="patients" className="cursor-pointer px-3 py-1 text-xs font-semibold">
            Archived Patients
          </TabsTrigger>

          <TabsTrigger value="consultations" className="cursor-pointer px-3 py-1 text-xs font-semibold">
            Archived Consultations
          </TabsTrigger>

          <TabsTrigger value="cases" className="cursor-pointer px-3 py-1 text-xs font-semibold">
            Archived Cases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="focus-visible:outline-none">
          <ArchivedPatients />
        </TabsContent>

        <TabsContent value="consultations" className="focus-visible:outline-none">
          <ArchivedRecords />
        </TabsContent>

        <TabsContent value="cases" className="focus-visible:outline-none">
          <ArchivedCases />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default Archive;
