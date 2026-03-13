"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  showPagination?: boolean;
  // Manual state props
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 50,
  showPagination = true,
  sorting: manualSorting,
  onSortingChange,
  pagination: manualPagination,
  onPaginationChange,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(), // Disable automatic sorting if manual is used
    onSortingChange: onSortingChange || setInternalSorting,
    onPaginationChange: onPaginationChange,
    manualPagination: !!onPaginationChange,
    manualSorting: !!onSortingChange,
    rowCount: rowCount,
    state: {
      sorting: manualSorting ?? internalSorting,
      ...(manualPagination && { pagination: manualPagination }),
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <>
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isAction = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.column.columnDef.size,
                      }}
                      className={isAction ? "w-0 text-right" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isAction = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.columnDef.size,
                        }}
                        className={isAction ? "py-0 text-right" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} />}
    </>
  );
}
