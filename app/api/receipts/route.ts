import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/prisma";
import { ReceiptStatus } from "@/app/generated/prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search");
  const dateParam = searchParams.get("date");
  const statusParam = searchParams.get("receiptStatus");

  // Sorting and Pagination parameters
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "50"));
  const skip = (page - 1) * limit;

  try {
    const where: any = { userId };

    if (search) {
      where.storeName = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (dateParam) {
      const date = new Date(dateParam);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.receiptDate = {
        gte: start,
        lte: end,
      };
    }

    if (statusParam) {
      where.status = {
        in: statusParam.split(",") as ReceiptStatus[],
      };
    }

    // Get total count for pagination metadata
    const totalCount = await db.receipt.count({ where });

    const receipts = await db.receipt.findMany({
      where,
      include: {
        category: true,
        items: true,
      },
      orderBy: sortBy
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: receipts,
      metadata: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[RECEIPTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
