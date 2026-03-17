"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description =
  "An interactive bar chart showing spending by category";

const chartConfig = {
  amount: {
    label: "ລາຍຈ່າຍ",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function ChartBarInteractive() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <Skeleton className="h-24 w-full" />
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 py-6 px-5">
          <CardTitle>ລາຍຈ່າຍແບ່ງຕາມປະເພດ</CardTitle>
          <CardDescription>ສະແດງລາຍຈ່າຍແຕ່ລະປະເພດໃນເດືອນນີ້</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data?.barChartData || []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="amount"
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
                />
              }
            />
            <Bar dataKey="amount" fill={`var(--color-amount)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
