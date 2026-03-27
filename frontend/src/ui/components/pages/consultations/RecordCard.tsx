import { useNavigate } from "react-router";
import { Card } from "../../shadcn/card";
import { Button } from "../../shadcn/button";
import { Pen, Trash } from "lucide-react";
import type { IRecord } from "@/types/RecordType";
import dayjs from "dayjs";
import { useDeleteRecord } from "@/services/apiRecords";

function RecordCard({ record }: { record: IRecord }) {
  const navigate = useNavigate();

  const { mutate: handleDeleteRecord } = useDeleteRecord();

  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
        navigate(
          `/patients/${record.patientId}/consultations/${record.id}/details`,
        );
      }}
      key={record.id}
      className="flex cursor-pointer flex-row items-center justify-between px-4 py-1 hover:bg-neutral-200"
    >
      <p className="text-xs">{record.symptoms}</p>
      <div className="flex items-center space-x-2">
        <p className="text-xs">
          {dayjs(record.createdAt).format("MMMM DD, YYYY")}
        </p>
        <Button
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRecord(record.id);
          }}
        >
          <Trash />
        </Button>
        <Button
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/patients/${record.patientId}/consultations/${record.id}/edit`,
            );
          }}
        >
          <Pen />
        </Button>
      </div>
    </Card>
  );
}

export default RecordCard;
