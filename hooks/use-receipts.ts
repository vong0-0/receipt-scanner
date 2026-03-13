import { useQuery } from "@tanstack/react-query";
import { Receipt, ReceiptStatus } from "@/types/receipt.type";

interface UseReceiptsFilters {
  search?: string;
  date?: string;
  receiptStatus?: ReceiptStatus[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface UseReceiptsResponse {
  data: Receipt[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useReceipts(filters: UseReceiptsFilters) {
  return useQuery<UseReceiptsResponse>({
    queryKey: ["receipts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.date) {
        // Handle both Date objects and strings
        const dateStr =
          typeof filters.date === "string"
            ? filters.date
            : new Date(filters.date).toISOString().split("T")[0];
        params.set("date", dateStr);
      }
      if (filters.receiptStatus && filters.receiptStatus.length > 0) {
        params.set("receiptStatus", filters.receiptStatus.join(","));
      }

      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());

      const response = await fetch(`/api/receipts?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch receipts");
      }
      return response.json();
    },
  });
}
