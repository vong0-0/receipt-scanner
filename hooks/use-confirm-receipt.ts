import { useMutation } from "@tanstack/react-query";
import { useUploadStore } from "./use-upload-store";
import { toast } from "sonner";

interface ConfirmReceiptPayload {
  imageUrl: string;
  category: string;
  storeName: string;
  totalAmount: number;
  receiptDate: string;
  taxAmount: number;
  ocrConfidence: number;
  status: "PENDING_REVIEW" | "REVIEWED";
  receiptItems: {
    name: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
}

async function confirmReceipt(payload: ConfirmReceiptPayload) {
  const res = await fetch("/api/receipts/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to save receipt");
  }

  return res.json();
}

export function useConfirmReceipt() {
  const { reset } = useUploadStore();

  return useMutation({
    mutationFn: confirmReceipt,
    onSuccess: () => {
      reset();
      toast.success("ບັນທຶກຂໍ້ມູນໃບບິນສຳເລັດແລ້ວ!");
    },
    onError: (error) => {
      toast.error(error.message || "ບັນທຶກຂໍ້ມູນລົ້ມເຫລວ ກະລຸນາລອງໃໝ່");
    },
  });
}
