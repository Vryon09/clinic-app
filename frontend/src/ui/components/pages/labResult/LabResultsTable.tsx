import type { ILabResult } from "@/types/LabResultType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import dayjs from "dayjs";
import { MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";
import { useDeleteLabResult } from "@/services/apiLabResults";

function LabResultsTable({ labResults }: { labResults: ILabResult[] }) {
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>File Type</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labResults.map((result) => {
          const pathSplit = result.filePath.split("\\");

          const fileName = pathSplit[pathSplit.length - 1]
            .split("-")
            .slice(1)
            .join()
            .split(".")[1]
            .toUpperCase();

          return (
            <TableRow
              onClick={(e) => {
                e.stopPropagation();
                window.open(`http://localhost:3000/${result.filePath}`);
              }}
              className="cursor-pointer hover:bg-neutral-200"
            >
              <TableCell>
                {dayjs(result.uploadedAt).format("MMMM DD, YYYY")}
              </TableCell>
              <TableCell>{fileName}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-xs" className="cursor-pointer">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLabResult(result.id);
                      }}
                    >
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default LabResultsTable;
