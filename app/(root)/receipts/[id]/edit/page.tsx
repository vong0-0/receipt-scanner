"use client";

import { useParams } from "next/navigation";
import { useReceipt } from "@/hooks/use-receipt";
import ReceiptForm from "@/components/receipt-form";
import { useUpdateReceipt } from "@/hooks/use-update-receipt";
import { Loader2 } from "lucide-react";
import AppHeader from "@/components/app-header";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";

export default function EditReceiptPage() {
  const { id } = useParams() as { id: string };
  const { data: receipt, isLoading } = useReceipt(id);
  const updateReceipt = useUpdateReceipt();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!receipt) {
    return <div>ບໍ່ພົບຂໍ້ມູນໃບບິນ</div>;
  }

  // Map API data to Form values
  const initialValues = {
    storeName: receipt.storeName,
    category: receipt.category?.name || "",
    totalAmount: receipt.totalAmount,
    taxAmount: receipt.taxAmount,
    receiptDate: new Date(receipt.receiptDate),
    receiptItems:
      receipt.receiptItems?.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice, // Map unitPrice to price for the form
        amount: item.amount,
      })) || [],
  };

  const handleSubmit = async (
    values: any,
    status: "PENDING_REVIEW" | "REVIEWED",
  ) => {
    await updateReceipt.mutateAsync({
      id,
      ...values,
      status,
    });
  };

  return (
    <>
      <AppHeader title="ແກ້ໄຂຂໍ້ມູນໃບບິນ" />
      <div className="px-4 lg:px-6 pt-6 space-y-2">
        <AppBreadcrumbs
          items={[
            { label: "ປະຫວັດໃບບິນ", href: "/receipts" },
            { label: "ລາຍລະອຽດໃບບິນ", href: `/receipts/${id}` },
            { label: "ແກ້ໄຂຂໍ້ມູນໃບບິນ" },
          ]}
        />
        <h1 className="text-4xl font-bold">ແກ້ໄຂຂໍ້ມູນໃບບິນ</h1>
      </div>
      <div className="@container/main p-4 lg:p-6">
        <ReceiptForm
          isEdit
          initialValues={initialValues}
          imageUrl={receipt.imageUrl}
          onSubmit={handleSubmit}
          isSubmitting={updateReceipt.isPending}
        />
      </div>
    </>
  );
}
