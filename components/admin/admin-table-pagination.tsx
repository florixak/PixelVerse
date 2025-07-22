"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Table } from "@tanstack/react-table";

type AdminTablePaginationProps<T> = {
  table: Table<T>;
};

const AdminTablePagination = <T,>({ table }: AdminTablePaginationProps<T>) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        {table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
          1}{" "}
        to{" "}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          table.getPrePaginationRowModel().rows.length
        )}{" "}
        of {table.getPrePaginationRowModel().rows.length}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminTablePagination;
