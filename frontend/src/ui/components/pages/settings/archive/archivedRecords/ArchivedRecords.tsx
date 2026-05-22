import {
  handleGetArchivedRecords,
  useRestoreRecord,
} from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { Button } from "@/ui/components/shadcn/button";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArchiveRestore } from "lucide-react";

function ArchivedRecords() {
  const { data: archivedRecords, isPending: isArchivedRecordsPending } =
    useQuery<IRecord[]>({
      queryFn: handleGetArchivedRecords,
      queryKey: ["archivedRecords"],
    });

  const { mutate: handleRestoreRecord } = useRestoreRecord();

  if (isArchivedRecordsPending) return <p>loading...</p>;

  return (
    <div>
      {archivedRecords?.length === 0 ? (
        <p>no archived Records</p>
      ) : (
        archivedRecords?.map((record, i) => (
          <div key={i} className="flex justify-between">
            <p>{dayjs(record.createdAt).format("MMMM DD, YYYY")}</p>

            <Button
              onClick={() => {
                handleRestoreRecord(record.id);
              }}
              size="icon"
            >
              <ArchiveRestore />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

export default ArchivedRecords;
