import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validateRequiredFields } from "@/lib/utils";
import db from "@/lib/prisma";

interface ConfirmReceiptItem {
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

export async function POST(req: NextRequest) {
  // Step 1: Session checking
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Step 2: Get and validate request body
  const body = await req.json();

  const validationError = validateRequiredFields(body, [
    "imageUrl",
    "storeName",
    "totalAmount",
  ]);

  if (validationError) return validationError;

  const {
    imageUrl,
    category,
    storeName,
    totalAmount,
    receiptDate,
    taxAmount,
    ocrConfidence,
    status = "REVIEWED",
    receiptItems = [],
  } = body;

  try {
    // Step 3: Handle category (upsert: find or create)
    let categoryId: string | null = null;

    if (category) {
      const existingCategory = await db.category.findUnique({
        where: { name: category },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await db.category.create({
          data: { name: category },
        });
        categoryId = newCategory.id;
      }
    }

    // Step 4: Save receipt + items to DB
    const receipt = await db.receipt.create({
      data: {
        userId,
        categoryId,
        storeName,
        totalAmount,
        receiptDate: receiptDate ? new Date(receiptDate) : null,
        taxAmount: taxAmount ?? null,
        imageUrl,
        ocrConfidence: ocrConfidence ?? null,
        status,
        items: {
          create: receiptItems.map((item: ConfirmReceiptItem) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            amount: item.amount,
          })),
        },
      },
      include: {
        items: true,
        category: true,
      },
    });

    // Step 5: Response
    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    console.error("Failed to confirm receipt:", error);
    return NextResponse.json(
      { error: "Failed to save receipt" },
      { status: 500 },
    );
  }
}
