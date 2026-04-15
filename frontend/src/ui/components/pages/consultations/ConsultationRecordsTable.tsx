import type { IRecord } from "@/types/RecordType";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";
import { useNavigate } from "react-router";
import { useDeleteRecord } from "@/services/apiRecords";

function ConsultationRecordsTable({ records }: { records: IRecord[] }) {
  const navigate = useNavigate();

  const { mutate: handleDeleteRecord } = useDeleteRecord();

  return (
    <Table>
      {!records.length && (
        <TableCaption>No consultations found for this patient.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow
            key={record.id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/patients/${record.patientId}/consultations/${record.id}/details`,
              );
            }}
            className="cursor-pointer hover:bg-neutral-200"
          >
            <TableCell>
              {dayjs(record.createdAt).format("MMMM DD, YYYY")}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-xs" className="cursor-pointer">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-neutral-200!"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/patients/${record.patientId}/consultations/${record.id}/edit`,
                      );
                    }}
                  >
                    <Pen /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecord(record.id);
                    }}
                  >
                    <Trash /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ConsultationRecordsTable;
