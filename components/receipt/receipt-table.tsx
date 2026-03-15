"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "../ui/data-table";
import { Receipt, ReceiptStatus } from "@/types/receipt.type";
import { FormattedDate } from "../ui/formatted-date";
import { FormattedCurrency } from "../ui/formatted-currency";
import { useState } from "react";
import { ReceiptStatusBadge } from "./receipt-status-badge";
import Link from "next/link";
import { useFilterStore } from "@/hooks/use-filter-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteReceipt } from "@/hooks/use-delete-receipt";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";
import { PaginatedResponse } from "@/types/api";

interface SortButtonProps {
  column: any;
  children: React.ReactNode;
}

const SortButton = ({ column, children }: SortButtonProps) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
      <span>{children}</span>
      {isSorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
      ) : isSorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "storeName",
    header: ({ column }) => <SortButton column={column}>ຮ້ານຄ້າ</SortButton>,
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => <SortButton column={column}>ຫມວດຫມູ່</SortButton>,
    cell: ({ row }) => {
      return row.original.category?.name || "-";
    },
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => <SortButton column={column}>ວັນທີ</SortButton>,
    cell: ({ row }) => {
      return <FormattedDate date={row.getValue("receiptDate")} />;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <SortButton column={column}>ມູນຄ່າ</SortButton>,
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount");
      return (
        <FormattedCurrency
          amount={
            typeof amount === "string" ? parseFloat(amount) : Number(amount)
          }
        />
      );
    },
  },
  {
    accessorKey: "ocrConfidence",
    header: ({ column }) => (
      <SortButton column={column}>ຄວາມຖືກຕ້ອງ</SortButton>
    ),
    cell: ({ row }) => {
      const confidence = row.getValue("ocrConfidence");
      if (confidence === null || confidence === undefined) return "-";
      const percentage = Math.round(Number(confidence) * 100);
      return <span>{percentage}%</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortButton column={column}>ສະຖານະ</SortButton>,
    cell: ({ row }) => {
      const status = row.getValue("status") as ReceiptStatus;
      return <ReceiptStatusBadge status={status} />;
    },
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const deleteReceipt = useDeleteReceipt();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      return (
        <>
          <ConfirmDialog
            title="ລົບໃບບິນ"
            description="ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້. ທ່ານຕ້ອງການລົບໃບບິນນີ້ແທ້ບໍ່?"
            confirmText="ລົບໃບບິນ"
            confirmVariant="destructive"
            onConfirm={() => deleteReceipt.mutateAsync(row.original.id)}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                asChild
              >
                <Link href={`/receipts/${row.original.id}`}>
                  <Eye className="size-4 text-muted-foreground" />
                  <span>ເບິ່ງລາຍລະອຽດ</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                asChild
              >
                <Link href={`/receipts/${row.original.id}/edit`}>
                  <Pencil className="size-4 text-muted-foreground" />
                  <span>ແກ້ໄຂລາຍລະອຽດ</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive w-full"
                onSelect={() => setShowDeleteDialog(true)}
                disabled={deleteReceipt.isPending}
              >
                <Trash className="size-4" />
                <span>ລົບໃບບິນ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default function ReceiptTable({
  data,
  metadata,
}: {
  data: Receipt[];
  metadata?: PaginatedResponse<Receipt>["metadata"];
}) {
  const { sortBy, sortOrder, page, limit, setSorting, setPage } =
    useFilterStore();

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sortBy ? [{ id: sortBy, desc: sortOrder === "desc" }] : []}
      onSortingChange={(updater) => {
        const next = typeof updater === "function" ? updater([]) : updater;
        if (next.length > 0) {
          setSorting(next[0].id, next[0].desc ? "desc" : "asc");
        }
      }}
      pagination={{
        pageIndex: page - 1,
        pageSize: limit,
      }}
      onPaginationChange={(updater) => {
        const next =
          typeof updater === "function"
            ? updater({ pageIndex: page - 1, pageSize: limit })
            : updater;
        setPage(next.pageIndex + 1);
      }}
      rowCount={metadata?.total || 0}
    />
  );
}
