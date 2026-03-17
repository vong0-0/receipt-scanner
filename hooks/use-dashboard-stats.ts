import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  summary: {
    totalSpend: number;
    percentageChange: number;
    receiptCount: number;
    avgSpend: number;
    topCategory: {
      name: string;
      amount: number;
      percentage: number;
    };
  };
  areaChartData: {
    date: string;
    currentMonth: number;
    prevMonth: number;
  }[];
  barChartData: {
    category: string;
    amount: number;
    fill: string;
  }[];
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      return response.json();
    },
  });
}
