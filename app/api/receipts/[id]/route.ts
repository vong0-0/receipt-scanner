import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    const receipt = await db.receipt.findUnique({
      where: { id, userId },
      include: {
        category: true,
        items: true,
      },
    });

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("[RECEIPT_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      storeName,
      category: categoryName,
      totalAmount,
      taxAmount,
      receiptDate,
      receiptItems,
      status,
    } = body;

    // Verify ownership
    const existingReceipt = await db.receipt.findUnique({
      where: { id, userId },
    });

    if (!existingReceipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Handle Category
    let categoryId = existingReceipt.categoryId;
    if (categoryName) {
      const category = await db.category.findFirst({
        where: { name: { equals: categoryName, mode: "insensitive" } },
      });
      if (category) {
        categoryId = category.id;
      } else {
        const newCategory = await db.category.create({
          data: { name: categoryName },
        });
        categoryId = newCategory.id;
      }
    }

    // Update with Transaction
    const updatedReceipt = await db.$transaction(async (tx) => {
      // 1. Delete existing items
      await tx.receiptItem.deleteMany({
        where: { receiptId: id },
      });

      // 2. Update receipt and create new items
      return await tx.receipt.update({
        where: { id, userId },
        data: {
          storeName,
          categoryId,
          totalAmount,
          taxAmount,
          receiptDate: new Date(receiptDate),
          status,
          items: {
            create: receiptItems.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              amount: item.amount,
            })),
          },
        },
        include: {
          category: true,
          items: true,
        },
      });
    });

    return NextResponse.json(updatedReceipt);
  } catch (error) {
    console.error("[RECEIPT_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  try {
    // Verify ownership
    const receipt = await db.receipt.findUnique({
      where: { id, userId },
    });

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 },
      );
    }

    // Delete uploaded image if exists
    if (receipt.imageUrl) {
      const { unlink } = await import("fs/promises");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "public", receipt.imageUrl);
      try {
        await unlink(filePath);
      } catch {
        // File might already be deleted, continue
      }
    }

    // Delete receipt (items cascade automatically via onDelete: Cascade)
    await db.receipt.delete({
      where: { id, userId },
    });

    return NextResponse.json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.error("[RECEIPT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
