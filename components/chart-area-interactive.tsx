"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { lo } from "@/lib/locales/lo";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/format";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description =
  "An interactive area chart comparing current and previous month spending";

const chartConfig = {
  prevMonth: {
    label: "ເດືອນຫລັງ",
    color: "var(--chart-1)",
  },
  currentMonth: {
    label: "ເດືອນປັດຈຸບັນ",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function ChartAreaInteractive() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <Skeleton className="h-14 w-full" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>ການໃຊ້ຈ່າຍລາຍເດືອນ</CardTitle>
          <CardDescription>ການໃຊ້ຈ่າຍທ່ຽບໃສ່ເດືອນທີ່ຜ່ານມາ</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data?.areaChartData || []}>
            <defs>
              <linearGradient id="fillPrevMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-prevMonth)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-prevMonth)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCurrentMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-currentMonth)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-currentMonth)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return format(new Date(value), "MMM d", { locale: lo });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Intl.NumberFormat("lo-LA", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return format(new Date(value), "MMM d, yyyy", {
                      locale: lo,
                    });
                  }}
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": item.color,
                          } as React.CSSProperties
                        }
                      />
                      <div className="flex flex-1 justify-between items-center gap-2">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                        </span>
                        <span className="font-mono font-medium tabular-nums">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    </>
                  )}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="currentMonth"
              type="monotone"
              fill="url(#fillCurrentMonth)"
              stroke="var(--color-currentMonth)"
              connectNulls
            />
            <Area
              dataKey="prevMonth"
              type="monotone"
              fill="url(#fillPrevMonth)"
              stroke="var(--color-prevMonth)"
              connectNulls
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
