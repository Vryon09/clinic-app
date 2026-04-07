import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "./shadcn/pagination";
import { Button } from "./shadcn/button";
import type { IPagination } from "@/types/Pagination";

function PaginationBar({
  itemName = "Item",
  paginationData,
  setPage,
}: {
  itemName: string;
  paginationData: IPagination;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const from = (paginationData.page - 1) * paginationData.limit + 1;
  const to = Math.min(
    paginationData.page * paginationData.limit,
    paginationData.total,
  );
  return (
    <div className="flex w-full items-center justify-between border-t border-neutral-300 py-2">
      <p className="text-sm">
        {itemName} {from === to ? from : `${from} - ${to}`} of{" "}
        {paginationData.total}
      </p>

      <div className="w-fit">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                onClick={() => {
                  if (paginationData.page === 1) return;
                  setPage((prev) => prev - 1);
                }}
                disabled={paginationData.page === 1}
                className="cursor-pointer"
                variant="ghost"
                size="icon-sm"
              >
                <ChevronsLeft />
              </Button>
            </PaginationItem>
            <p className="text-sm">{paginationData.page}</p>
            <PaginationItem>
              <Button
                onClick={() => {
                  if (paginationData.page === paginationData.pages) return;
                  setPage((prev) => prev + 1);
                }}
                disabled={paginationData.page === paginationData.pages}
                className="cursor-pointer"
                variant="ghost"
                size="icon-sm"
              >
                <ChevronsRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default PaginationBar;
