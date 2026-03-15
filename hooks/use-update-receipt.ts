import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditReceiptFormValues } from "@/schema/receipt.schema";

interface UpdateReceiptPayload extends EditReceiptFormValues {
  id: string;
  status: "PENDING_REVIEW" | "REVIEWED";
}

async function updateReceipt(payload: UpdateReceiptPayload) {
  const { id, ...data } = payload;
  const res = await fetch(`/api/receipts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update receipt");
  }

  return res.json();
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateReceipt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["receipt", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("ອັບເດດຂໍ້ມູນໃບບິນສຳເລັດແລ້ວ!");
      router.push(`/receipts/${variables.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "ອັບເດດຂໍ້ມູນລົ້ມເຫລວ ກະລຸນາລອງໃໝ່");
    },
  });
}
