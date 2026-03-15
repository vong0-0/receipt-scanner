import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/receipts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete receipt");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("ລົບໃບບິນສຳເລັດແລ້ວ");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      router.push("/receipts");
    },
    onError: () => {
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການລົບໃບບິນ");
    },
  });
}
