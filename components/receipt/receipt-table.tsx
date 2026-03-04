"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "../ui/data-table";
import { Receipt } from "@/types/receipt.type";
import { Receipt_Mock_Data } from "@/mock";
import { ReceiptStatusBadge } from "./receipt-status-badge";

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "storeName",
    header: "ຮ້ານຄ້າ",
  },
  {
    accessorKey: "categoryId",
    header: "ປະເພດ",
    cell: ({ row }) => {
      const category = row.getValue("categoryId");
      if (typeof category === "string") return category;
      if (category && typeof category === "object" && "name" in category) {
        return (category as any).name;
      }
      return "N/A";
    },
  },
  {
    accessorKey: "receiptDate",
    header: "ວັນທີ",
    cell: ({ row }) => {
      const date = new Date(row.getValue("receiptDate"));
      return new Intl.DateTimeFormat("lo-LA", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    },
  },
  {
    accessorKey: "totalAmount",
    header: "ມູນຄ່າ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
      }).format(amount);
    },
  },
  {
    accessorKey: "orcConfidence",
    header: "ຄວາມຖືກຕ້ອງ",
    cell: ({ row }) => {
      const confidence = parseFloat(row.getValue("orcConfidence"));
      const percentage = Math.round(confidence * 100);
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
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Eye className="size-4 text-muted-foreground" />
              <span>ເບິ່ງລາຍລະອຽດ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Pencil className="size-4 text-muted-foreground" />
              <span>ແກ້ໄຂລายລະອຽດ</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Trash className="size-4" />
              <span>ລົບໃບບິນ</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ReceiptTable() {
  return <DataTable columns={columns} data={Receipt_Mock_Data} />;
}
