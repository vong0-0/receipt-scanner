"use client";

import { useUploadStore } from "@/hooks/use-upload-store";
import { useConfirmReceipt } from "@/hooks/use-confirm-receipt";
import { CheckCircle2 } from "lucide-react";
import ReceiptForm from "../receipt-form";

export function UploadSuccessList() {
  const { status, ocrResult } = useUploadStore();
  const confirmMutation = useConfirmReceipt();

  if (status !== "success" || !ocrResult) return null;

  const { ocr, imageUrl } = ocrResult;

  // Map OCR response to ReceiptForm initial values
  const formValues = {
    category: ocr.category || "",
    storeName: ocr.storeName || "",
    totalAmount: ocr.totalAmount || 0,
    receiptDate: ocr.receiptDate ? new Date(ocr.receiptDate) : new Date(),
    taxAmount: ocr.taxAmount || 0,
    receiptItems: ocr.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.unitPrice,
      amount: item.amount,
    })),
  };

  function handleSubmit(values: any) {
    confirmMutation.mutate({
      imageUrl,
      category: values.category,
      storeName: values.storeName,
      totalAmount: values.totalAmount,
      receiptDate: values.receiptDate instanceof Date
        ? values.receiptDate.toISOString()
        : values.receiptDate,
      taxAmount: values.taxAmount,
      ocrConfidence: ocr.confidence,
      receiptItems: values.receiptItems,
    });
  }

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
          {ocr.confidence < 0.7 && (
            <p className="text-amber-600 text-sm font-medium mt-1">
              ⚠️ ຄວາມໝັ້ນໃຈໃນການອ່ານ: {Math.round(ocr.confidence * 100)}% —
              ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ລະອຽດ
            </p>
          )}
        </div>
      </div>

      <ReceiptForm
        onSubmit={handleSubmit}
        initialValues={formValues}
        imageUrl={imageUrl}
        isSubmitting={confirmMutation.isPending}
      />
    </div>
  );
}
