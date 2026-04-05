import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "./shadcn/pagination";
import { Button } from "./shadcn/button";

function PaginationBar() {
  return (
    <div className="flex w-full items-center justify-between border-t border-neutral-300 py-2">
      <p className="text-sm">Showing 1 - 4 of 4</p>

      <div className="w-fit">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button className="cursor-pointer" variant="ghost" size="icon-sm">
                <ChevronsLeft />
              </Button>
            </PaginationItem>
            <p className="text-sm">1</p>
            <PaginationItem>
              <Button className="cursor-pointer" variant="ghost" size="icon-sm">
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
