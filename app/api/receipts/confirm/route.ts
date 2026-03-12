import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validateRequiredFields } from "@/lib/utils";
import db from "@/lib/prisma";
import { type ReceiptItem } from "@/app/generated/prisma/client";

export async function POST(req: NextRequest) {
  // Step 1: Session checking
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  // Step 2: Get and validate request body
  const body = await req.json();

  // Validate required fields
  const validationError = validateRequiredFields(body, [
    "imageUrl",
    "category.name",
    "storeName",
    "totalAmount",
    "receiptDate",
    "taxAmount",
    "confidence",
    "items.name",
    "items.quantity",
    "items.unitPrice",
    "items.amount",
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
    items = [],
  } = body;

  // Step3: Handle category
  let categoryId: string | null = null;

  if (category !== null && category !== undefined) {
    // Find existing category
    let existingCategory = await db.category.findUnique({
      where: { name: category.name },
    });

    // if not exsit -> create new one
    if (!existingCategory) {
      existingCategory = await db.category.create({
        data: {
          name: category.name,
        },
      });
    }

    categoryId = existingCategory.id;
  }

  // Step 4: Save receipt + items to DB
  const receipt = await db.receipt.create({
    data: {
      userId,
      categoryId,
      storeName: storeName,
      totalAmount: totalAmount,
      receiptDate: receiptDate,
      taxAmount: taxAmount ?? null,
      imageUrl,
      ocrConfidence: ocrConfidence,
      status: "PENDING_REVIEW",
      items: {
        create: items.map((item: ReceiptItem) => ({
          name: item.name,
          quantity: item.name,
          unitPrice: item.name,
          amount: item.unitPrice,
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
}
