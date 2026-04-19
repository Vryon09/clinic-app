import type { ILabResult } from "@/types/LabResultType";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Skeleton } from "../../shadcn/skeleton";

function LabResultsTable({
  labResults,
  isLabResultsPending,
}: {
  labResults: ILabResult[];
  isLabResultsPending: boolean;
}) {
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();

  return (
    <Table>
      {!isLabResultsPending && !labResults.length && (
        <TableCaption>No lab results found for this patient.</TableCaption>
      )}
      <TableHeader>
        {isLabResultsPending ? (
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-16 bg-neutral-300" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-16 bg-neutral-300" />
            </TableHead>
          </TableRow>
        ) : (
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        )}
      </TableHeader>
      <TableBody>
        {isLabResultsPending
          ? Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-neutral-300" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-neutral-300" />
                </TableCell>
                <TableCell className="flex items-center justify-end">
                  <Skeleton className="h-4 w-8 bg-neutral-300" />
                </TableCell>
              </TableRow>
            ))
          : labResults.map((result) => {
              const pathSplit = result.filePath.split("\\");

              const fileName = pathSplit[pathSplit.length - 1]
                .split("-")
                .slice(1)
                .join()
                .split(".")[1]
                .toUpperCase();

              return (
                <TableRow
                  key={result.id}
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
