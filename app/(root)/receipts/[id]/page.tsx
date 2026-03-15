"use client";

import AppHeader from "@/components/app-header";
import ReceiptImagePlaceholder from "@/components/receipt/receipt-image-placeholder";
import { formatDateTime } from "@/lib/format";
import ReceiptOCRAccuracy from "@/components/receipt/receipt-ocr-accuracy";
import { Button } from "@/components/ui/button";
import { Loader2, Pen, Trash } from "lucide-react";
import {
  ReceiptDetailItems,
  ReceiptDetailSummary,
} from "@/components/receipt/receipt-detail-info";
import { useReceipt } from "@/hooks/use-receipt";
import { useParams } from "next/navigation";
import { useDeleteReceipt } from "@/hooks/use-delete-receipt";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Image from "next/image";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const { data: receipt, isLoading, error } = useReceipt(id);
  const deleteReceipt = useDeleteReceipt();

  if (isLoading) {
    return (
      <>
        <AppHeader title="ໃບບິນ" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground font-medium">
              ກຳລັງໂຫລດຂໍ້ມູນ...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !receipt) {
    return (
      <>
        <AppHeader title="ໃບບິນ" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground font-medium">
              ບໍ່ພົບໃບບິນທີ່ຕ້ອງການ
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={`ໃບບິນ ${id}`} />
      <div className="@container/main flex flex-1 flex-col gap-6 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 pt-6 pb-4 md:pb-3">
          {/* Store name and date */}
          <div className="flex flex-col gap-1  ">
            <h1 className="text-2xl font-bold">{receipt?.storeName}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(receipt?.receiptDate)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 items-center">
            <div>
              <Button
                variant="outline"
                className="hidden xs:flex bg-sky-600 text-white"
              >
                ແກ້ໄຂ
              </Button>
              <Button
                variant="outline"
                className="xs:hidden bg-sky-600 text-white"
                size="icon"
                aria-label="Submit"
              >
                <Pen className="size-3.5" />
              </Button>
            </div>
            <ConfirmDialog
              title="ລົບໃບບິນ"
              description="ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້. ຂໍ້ມູນໃບບິນນີ້ຈະຖືກລຶບອອກຈາກລະບົບຢ່າງຖາວອນ."
              confirmText="ລົບ"
              confirmVariant="destructive"
              onConfirm={() => deleteReceipt.mutateAsync(id)}
            >
              <div>
                <Button
                  variant="outline"
                  className="hidden xs:flex bg-rose-600 text-white"
                >
                  ລົບ
                </Button>
                <Button
                  variant="outline"
                  className="xs:hidden bg-rose-600 text-white"
                  size="icon"
                  aria-label="Delete"
                >
                  <Trash className="size-3.5" />
                </Button>
              </div>
            </ConfirmDialog>
          </div>
        </div>
        <div className="flex flex-col @3xl/main:flex-row gap-6 pb-6">
          <div className="flex flex-col flex-1 lg:max-w-[500px]">
            {/* Receipt image and OCR accuracy */}
            <div className="h-[450px]">
              {receipt?.imageUrl ? (
                <Image
                  className="w-full h-full object-cover"
                  src={receipt.imageUrl}
                  alt={receipt?.storeName || "Receipt"}
                  width={1000}
                  height={1000}
                  unoptimized
                />
              ) : (
                <ReceiptImagePlaceholder />
              )}
            </div>
            <div className="p-4 border border-solid border-black">
              <ReceiptOCRAccuracy ocrConfidence={receipt?.ocrConfidence} />
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-6 @4xl/main:gap-4">
            <ReceiptDetailSummary receipt={receipt} />
            <ReceiptDetailItems receipt={receipt} />
          </div>
        </div>
      </div>
    </>
  );
}
