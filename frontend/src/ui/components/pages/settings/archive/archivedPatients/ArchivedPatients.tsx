import { handleGetArchivedPatients } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { Button } from "@/ui/components/shadcn/button";
import { useQuery } from "@tanstack/react-query";
import { ArchiveRestore } from "lucide-react";

function ArchivedPatients() {
  const { data: archivedPatients, isPending: isArchivedPatientsPending } =
    useQuery<IPatient[]>({
      queryFn: handleGetArchivedPatients,
      queryKey: ["archivedPatients"],
    });

  if (isArchivedPatientsPending) return <p>loading...</p>;

  return (
    <div>
      {archivedPatients?.length === 0 ? (
        <p>no archived patients</p>
      ) : (
        archivedPatients?.map((patient, i) => (
          <div key={i} className="flex justify-between">
            <p>{patient.firstName}</p>

            <Button size="icon">
              <ArchiveRestore />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

export default ArchivedPatients;
