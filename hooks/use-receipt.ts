import { useQuery } from "@tanstack/react-query";
import { Receipt } from "@/types/receipt.type";

export function useReceipt(id: string) {
  return useQuery<Receipt>({
    queryKey: ["receipt", id],
    queryFn: async () => {
      const response = await fetch(`/api/receipts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch receipt");
      }
      const data = await response.json();
      // Map Prisma's `items` to our Receipt type's `receiptItems`
      return {
        ...data,
        receiptItems: data.items || [],
      };
    },
    enabled: !!id,
  });
}
