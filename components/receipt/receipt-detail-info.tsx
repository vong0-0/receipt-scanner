"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReceiptStatusBadge } from "./receipt-status-badge";
import { formatDateTime, formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Receipt, ReceiptItem } from "@/types/receipt.type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { FormattedCurrency } from "../ui/formatted-currency";

export function ReceiptDetailInfoWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border-black rounded-lg **:data-[slot=card-header]:gap-1 **:data-[slot=card-content]:flex **:data-[slot=card-content]:flex-col **:data-[slot=card-content]:gap-4",
        className,
      )}
    >
      {children}
    </Card>
  );
}

export function InfoRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="info-row"
      className={cn(
        "text-sm flex justify-between items-center pb-1.5 border-b border-zinc-500 last:border-0",
        className,
      )}
    >
      <p className="text-muted-foreground">{label}</p>
      <div className="font-medium">{children}</div>
    </div>
  );
}

export function ReceiptDetailSummary({ receipt }: { receipt: Receipt }) {
  return (
    <ReceiptDetailInfoWrapper className="**:data-[slot=card-title]:text-xl">
      <CardHeader>
        <CardTitle>ລາຍລະອຽດໃບບິນ</CardTitle>
        <CardDescription>ສະແດງລາຍລະອຽດໃບບິນໂດຍສະຫລຸບ</CardDescription>
      </CardHeader>
      <CardContent>
        <InfoRow label="ສະຖານະ">
          <ReceiptStatusBadge status={receipt?.status} />
        </InfoRow>
        <InfoRow label="ຊື່ຮ້ານ">
          <p>{receipt?.storeName}</p>
        </InfoRow>
        <InfoRow label="ວັນທີ">
          <p>{formatDateTime(receipt?.receiptDate)}</p>
        </InfoRow>
        <InfoRow label="ຫມວດຫມູ່">
          <p>{receipt?.category?.name}</p>
        </InfoRow>
      </CardContent>
    </ReceiptDetailInfoWrapper>
  );
}

export const columns: ColumnDef<ReceiptItem>[] = [
  {
    accessorKey: "name",
    header: "ລາຍການ",
  },
  {
    accessorKey: "quantity",
    header: "ຈຳນວນ",
    cell: ({ row }) => {
      return (
        <FormattedCurrency amount={parseFloat(row.getValue("quantity"))} />
      );
    },
  },
  {
    accessorKey: "unitPrice",
    header: "ລາຄາຕໍ່ອັນ/ບໍລິການ",
    cell: ({ row }) => {
      return (
        <FormattedCurrency amount={parseFloat(row.getValue("unitPrice"))} />
      );
    },
  },
  {
    accessorKey: "amount",
    header: "ມູນຄ່າລວມ",
    cell: ({ row }) => {
      return <FormattedCurrency amount={parseFloat(row.getValue("amount"))} />;
    },
  },
];

export function ReceiptDetailItems({ receipt }: { receipt: Receipt }) {
  return (
    <ReceiptDetailInfoWrapper className="**:data-[slot=card-title]:text-xl">
      <CardHeader>
        <CardTitle>ລາຍການສິນຄ້າ / ບໍລິການ</CardTitle>
        <CardDescription>ສະແດງລາຍການສິນຄ້າ ແລະ ບໍລິການທັງໝົດ</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={receipt.receiptItems}
          showPagination={false}
        />
        <div className="flex items-center justify-between bg-black text-white rounded-md px-4 py-2 font-bold">
          <span>ລາຄາລວມທັງໝົດ</span>
          <span>{formatCurrency(receipt.totalAmount)}</span>
        </div>
      </CardContent>
    </ReceiptDetailInfoWrapper>
  );
}
