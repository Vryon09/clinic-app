import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "./shadcn/pagination";
import { Button } from "./shadcn/button";
import type { IPagination } from "@/types/Pagination";
import { Skeleton } from "./shadcn/skeleton";

function PaginationBar({
  itemName = "Item",
  paginationData,
  setPage,
  isLoading,
}: {
  itemName: string;
  paginationData: IPagination;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}) {
  const from = isLoading
    ? null
    : !paginationData?.pages
      ? 0
      : (paginationData.page - 1) * paginationData.limit + 1;
  const to = isLoading
    ? null
    : Math.min(
        paginationData.page * paginationData.limit,
        paginationData.total,
      );

  return (
    <div className="mt-4 flex w-full items-center justify-between border-t border-border/60 px-2 pt-3 pb-1">
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-32 rounded-md bg-muted/60" />
          <Skeleton className="h-8 w-28 rounded-lg bg-muted/60" />
        </>
      ) : (
        <>
          <p className="text-xs font-medium text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{from === to ? from : `${from}–${to}`}</span> of{" "}
            <span className="font-semibold text-foreground">{paginationData?.total || 0}</span> {itemName}s
          </p>

          <div className="w-fit">
            <Pagination>
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <Button
                    onClick={() => {
                      if (paginationData.page === 1) return;
                      setPage((prev) => prev - 1);
                    }}
                    disabled={paginationData.page === 1}
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg border-border/80 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
                    title="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </PaginationItem>

                <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 text-xs font-semibold text-foreground">
                  {paginationData?.page || 1}
                </div>

                <PaginationItem>
                  <Button
                    onClick={() => {
                      if (
                        paginationData.page === paginationData.pages ||
                        !paginationData.pages
                      )
                        return;
                      setPage((prev) => prev + 1);
                    }}
                    disabled={
                      paginationData.page === paginationData.pages ||
                      !paginationData.pages
                    }
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg border-border/80 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
                    title="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}

export default PaginationBar;
