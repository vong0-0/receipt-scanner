"use client";

import { useUploadStore } from "@/hooks/use-upload-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ReceiptStatusBadge } from "../receipt/receipt-status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  ArrowRight,
  CheckCircle2,
  MoreHorizontal,
  FileText,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import ReceiptForm from "../receipt-form";
import { CreateReceiptSchema, ReceiptCategory } from "@/schema";

export function UploadSuccessList() {
  const { status } = useUploadStore();

  if (status !== "success") return null;

  function handleSubmit(values: CreateReceiptSchema) {
    console.log({ ...values, receiptDate: values.receiptDate.toISOString() });
  }

  const test_data = {
    category: "Shopping" as ReceiptCategory,
    storeName: "ຮ້ານ ມິມາດ",
    totalAmount: 22000,
    receiptDate: "2025-12-09",
    taxAmount: 0,
    receiptItems: [
      {
        name: "ມິ້ວເວດ ສີດຳ (44167)",
        quantity: 1,
        price: 3000,
        amount: 3000,
      },
      {
        name: "ມີຊອງ ເກົາຫຼີ ສີດຳ ຜັດເຜັດ*5(12)",
        quantity: 1,
        price: 19000,
        amount: 19000,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
          <CheckCircle2 className="size-12" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black">ສະແກນໃບບິນສຳເລັດແລ້ວ!</h2>
          <p className="text-muted-foreground">
            ໃບບີນຖືກສະແກນແລ້ວ ທ່ານສາມາດກວດສອບຄວາມຖືກຕ້ອງ ແລະ
            ແກ້ໄຂຂໍ້ມູນທີ່ຜິດໄດ້ກ່ອນບັນທຶກຂໍ້ມູນ
          </p>
        </div>
      </div>

      <ReceiptForm onSubmit={handleSubmit} initialValues={test_data} />
    </div>
  );
}
