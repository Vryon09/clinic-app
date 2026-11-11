import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../../shadcn/card";
import { Button } from "../../../shadcn/button";
import { Pen, Trash } from "lucide-react";
import type { IRecord } from "@/types/RecordType";
import dayjs from "dayjs";
import { useDeleteRecord } from "@/services/apiRecords";
import ConfirmDialog from "@/ui/components/common/ConfirmDialog";

function RecordCard({ record }: { record: IRecord }) {
  const navigate = useNavigate();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { mutate: handleDeleteRecord } = useDeleteRecord();

  return (
    <>
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
        <p className="text-xs font-semibold">{record.symptoms}</p>
        <div className="flex items-center space-x-2">
          <p className="text-xs">
            {dayjs(record.createdAt).format("MMMM DD, YYYY")}
          </p>
          <Button
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmDeleteOpen(true);
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

      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Delete Consultation Record?"
        description="Are you sure you want to delete this consultation record? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => handleDeleteRecord(record.id)}
      />
    </>
  );
}

export default RecordCard;
