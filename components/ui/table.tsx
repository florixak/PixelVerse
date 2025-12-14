"use client";

import { flexRender, useReactTable } from "@tanstack/react-table";
import TablePagination from "./table-pagination";

type TableProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  columnsLength: number;
};

const Table = <T,>({ table, columnsLength }: TableProps<T>) => {
  const rows = table.getRowModel().rows || [];
  return (
    <>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnsLength} className="h-24 text-center">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
    </>
  );
};

export default Table;
