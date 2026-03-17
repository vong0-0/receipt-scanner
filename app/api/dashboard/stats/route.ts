import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format, eachDayOfInterval, isSameDay } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  try {
    // Fetch all receipts for determining stats and charts
    const [currentMonthReceipts, lastMonthReceipts, categories] = await Promise.all([
      db.receipt.findMany({
        where: {
          userId,
          receiptDate: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
        include: { category: true },
      }),
      db.receipt.findMany({
        where: {
          userId,
          receiptDate: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
      db.category.findMany(),
    ]);

    // Summary Statistics
    const currentTotal = currentMonthReceipts.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const lastTotal = lastMonthReceipts.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    
    let percentageChange = 0;
    if (lastTotal > 0) {
      percentageChange = ((currentTotal - lastTotal) / lastTotal) * 100;
    } else if (currentTotal > 0) {
      percentageChange = 100;
    }

    const avgSpend = currentMonthReceipts.length > 0 ? currentTotal / currentMonthReceipts.length : 0;

    // Top Category
    const categorySpending: Record<string, number> = {};
    currentMonthReceipts.forEach(r => {
      if (r.category) {
        categorySpending[r.category.name] = (categorySpending[r.category.name] || 0) + Number(r.totalAmount);
      }
    });

    let topCategory = { name: "N/A", amount: 0, percentage: 0 };
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      topCategory = {
        name: sortedCategories[0][0],
        amount: sortedCategories[0][1],
        percentage: currentTotal > 0 ? (sortedCategories[0][1] / currentTotal) * 100 : 0
      };
    }

    // Chart Data - Area Chart (Comparative Days)
    const lastMonthDayTotals = lastMonthReceipts.reduce((acc, r) => {
      if (r.receiptDate) {
        const d = new Date(r.receiptDate);
        const dayNum = d.getDate();
        acc[dayNum] = (acc[dayNum] || 0) + Number(r.totalAmount);
      }
      return acc;
    }, {} as Record<number, number>);

    const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
    const chartData = daysInMonth.map(day => {
      const dayNum = day.getDate();
      
      const currentDayTotal = currentMonthReceipts
        .filter(r => r.receiptDate && isSameDay(r.receiptDate, day))
        .reduce((sum, r) => sum + Number(r.totalAmount), 0);

      const lastDayTotal = lastMonthDayTotals[dayNum] || 0;

      return {
        date: format(day, "yyyy-MM-dd"),
        currentMonth: currentDayTotal,
        prevMonth: lastDayTotal,
      };
    });

    // Chart Data - Bar Chart (Category Distribution this month)
    const barChartData = categories.map(cat => ({
      category: cat.name,
      amount: categorySpending[cat.name] || 0,
      fill: cat.color || "var(--color-primary)",
    })).filter(item => item.amount > 0);

    return NextResponse.json({
      summary: {
        totalSpend: currentTotal,
        percentageChange,
        receiptCount: currentMonthReceipts.length,
        avgSpend,
        topCategory,
      },
      areaChartData: chartData,
      barChartData,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
