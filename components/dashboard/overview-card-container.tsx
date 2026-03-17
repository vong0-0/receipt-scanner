"use client";

import OverviewCard from "./overview-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { lo } from "@/lib/locales/lo";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewCardContainer() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const summary = data?.summary;
  const currentMonthName = format(new Date(), "MMMM yyyy", { locale: lo });

  const cards = [
    {
      title: "ການໃຊ້ຈ່າຍຂອງເດືອນນີ້",
      value: formatCurrency(summary?.totalSpend || 0),
      footerDescription: `${summary?.percentageChange && summary.percentageChange > 0 ? "+" : ""}${Math.round(summary?.percentageChange || 0)}% ຈາກເດືອນທີ່ຜ່ານມາ`,
    },
    {
      title: "ຈຳນວນໃບບິນທັ້ງຫມົດ",
      value: (summary?.receiptCount || 0).toString(),
      footerDescription: currentMonthName,
    },
    {
      title: "ການໃຊ້ຈ່າຍໂດຍສະເລ່ຍ",
      value: formatCurrency(summary?.avgSpend || 0),
      footerDescription: "ຄຳນວນຈາກໃບບິນທັງໝົດໃນເດືອນນີ້",
    },
    {
      title: "ຫມວດຫມູ່ທີ່ໃຊ້ຈ່າຍຫຼາຍທີ່ສຸດ",
      value: summary?.topCategory.name || "N/A",
      footerDescription: `${Math.round(summary?.topCategory.percentage || 0)}% ຂອງຄ່າໃຊ້ຈ່າຍທັງຫມົດ`,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/2 *:data-[slot=card]:gap-3 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((data) => (
        <OverviewCard
          key={data.title}
          title={data.title}
          value={data.value}
          footerDescription={data.footerDescription}
        />
      ))}
    </div>
  );
}
