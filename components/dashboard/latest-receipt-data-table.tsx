"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { Receipt } from "@/types/receipt.type";
import { FormattedDate } from "../ui/formatted-date";
import { FormattedCurrency } from "../ui/formatted-currency";
import { ReceiptStatusBadge } from "../receipt/receipt-status-badge";
import { useReceipts } from "@/hooks/use-receipts";
import { Skeleton } from "@/components/ui/skeleton";

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "storeName",
    header: "ຮ້ານຄ້າ",
  },
  {
    accessorKey: "category.name",
    header: "ຫມວດຫມູ່",
    cell: ({ row }) => row.original.category?.name || "-",
  },
  {
    accessorKey: "receiptDate",
    header: "ວັນທີ",
    cell: ({ row }) => {
      return <FormattedDate date={row.getValue("receiptDate")} />;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "ມູນຄ່າ",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount");
      return (
        <FormattedCurrency 
          amount={typeof amount === "string" ? parseFloat(amount) : Number(amount)} 
        />
      );
    },
  },
  {
    accessorKey: "ocrConfidence",
    header: "ความถูกต้ออง",
    cell: ({ row }) => {
      const confidence = row.getValue("ocrConfidence");
      if (confidence === null || confidence === undefined) return "-";
      const percentage = Math.round(Number(confidence) * 100);
      return <span>{percentage}%</span>;
    },
  },
  {
    accessorKey: "status",
    header: "ສະຖານະ",
    cell: ({ row }) => {
      const status = row.getValue("status") as any;
      return <ReceiptStatusBadge status={status} />;
    },
  },
];

export default function LatestReceiptDataTable() {
  const { data, isLoading } = useReceipts({
    limit: 10,
    sortBy: "receiptDate",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      pageSize={10}
      showPagination={false}
    />
  );
}
